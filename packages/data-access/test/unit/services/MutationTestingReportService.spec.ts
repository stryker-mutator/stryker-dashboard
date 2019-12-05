import { expect } from 'chai';
import { MutantStatus, MutationTestResult, FileResult, FileResultDictionary } from 'mutation-testing-report-schema';
import sinon = require('sinon');
import { MutationTestingReport } from '../../../src/models';
import { MutationTestingReportMapper, OptimisticConcurrencyError } from '../../../src/';
import { MutationTestingResultMapper } from '../../../src/mappers/MutationTestingResultMapper';
import { MutationTestingReportService } from '../../../src/services/MutationTestingReportService';
import { createTableMapperMock } from '../../helpers/mock';
import { ReportIdentifier, Report } from '@stryker-mutator/dashboard-common';

describe(MutationTestingReportService.name, () => {

  let sut: MutationTestingReportService;
  let reportMapperMock: sinon.SinonStubbedInstance<MutationTestingReportMapper>;
  let resultMapperMock: sinon.SinonStubbedInstance<MutationTestingResultMapper>;

  beforeEach(() => {
    reportMapperMock = createTableMapperMock();
    resultMapperMock = sinon.createStubInstance(MutationTestingResultMapper);
    sut = new MutationTestingReportService(resultMapperMock as unknown as MutationTestingResultMapper, reportMapperMock);
  });

  describe('saveReport', () => {

    it('should update the expected report using the score from metrics', async () => {
      // Arrange
      const expectedResult = createMutationTestResult(createFileResultDictionary(createFileResult([MutantStatus.Killed, MutantStatus.Survived])));
      const reportIdentifier = { version: 'feat/dashboard', moduleName: undefined, projectName: 'github.com/testOrg/testName' };
      const expectedMutationTestingReport: MutationTestingReport = {
        ...reportIdentifier,
        mutationScore: 50, // 1 Survived, 1 Killed
      };

      // Act
      await sut.saveReport(reportIdentifier, expectedResult);

      // Assert
      expect(reportMapperMock.insertOrMerge).calledWith(expectedMutationTestingReport);
      expect(resultMapperMock.insertOrMerge).calledWith(reportIdentifier, expectedResult);
    });

    it('should normalize file names in the report', async () => {
      // Arrange
      const rawResult = createMutationTestResult({
        ['a/b/c/d']: createFileResult(),
        ['a/b/e/f']: createFileResult()
      });
      const expectedResult = createMutationTestResult({
        ['c/d']: createFileResult(),
        ['e/f']: createFileResult()
      });
      const reportIdentifier = { version: 'feat/dashboard', moduleName: undefined, projectName: 'github.com/testOrg/testName' };

      // Act
      await sut.saveReport(reportIdentifier, rawResult);

      // Assert
      expect(resultMapperMock.insertOrMerge).calledWith(reportIdentifier, expectedResult);
    });

    it('should support a score-only-report', async () => {
      // Arrange
      const expectedMutationScore = 81;
      const expectedResult = {
        mutationScore: expectedMutationScore
      };
      const reportIdentifier = { version: 'feat/dashboard', moduleName: 'core', projectName: 'github.com/testOrg/testName' };

      // Act
      await sut.saveReport(reportIdentifier, expectedResult);

      // Assert
      const expectedMutationTestingReport: MutationTestingReport = {
        version: 'feat/dashboard',
        mutationScore: expectedMutationScore,
        moduleName: 'core',
        projectName: 'github.com/testOrg/testName'
      };
      expect(reportMapperMock.insertOrMerge).calledWith(expectedMutationTestingReport);
      expect(resultMapperMock.insertOrMerge).calledWith(reportIdentifier, null);
    });

    describe('for a module in a project', () => {

      it('should aggregate the project\'s report', async () => {
        // Arrange
        const projectName = 'github.com/testOrg/testName';
        const version = 'feat/something';
        const fileResultModule1 = createFileResult([MutantStatus.Killed]);
        const fileResultModule2 = createFileResult([MutantStatus.NoCoverage]);
        const module1Result = createMutationTestResult({ 'a/b': fileResultModule1 });
        const module2Result = createMutationTestResult({ 'a/b': fileResultModule2 });
        const module1Report: MutationTestingReport = { moduleName: 'core', mutationScore: 80, projectName, version };
        const module2Report: MutationTestingReport = { moduleName: 'api', mutationScore: 80, projectName, version };
        reportMapperMock.findAll.resolves([{ model: module1Report, etag: '' }, { model: module2Report, etag: '' }]);
        reportMapperMock.findOne.resolves({ etag: 'old-project-etag', model: module1Report /* not used */ });
        const module1Identifier = { version, moduleName: 'core', projectName };
        resultMapperMock.findOne
          .withArgs(module1Report).resolves(module1Result)
          .withArgs(module2Report).resolves(module2Result);

        // Act
        await sut.saveReport(module1Identifier, module1Result);

        // Act
        const expectedProjectResult = createMutationTestResult({
          'core/a/b': fileResultModule1,
          'api/a/b': fileResultModule2
        });
        const expectedProjectId: ReportIdentifier = { projectName, version, moduleName: undefined };
        const expectedMutationTestingReport: MutationTestingReport = { ...expectedProjectId, mutationScore: 50 }; // one killed and one noCoverage
        expect(resultMapperMock.insertOrMerge).calledWith(expectedProjectId, expectedProjectResult);
        expect(reportMapperMock.replace).calledWith(expectedMutationTestingReport, 'old-project-etag');
      });

      it('should retry the projects report when an OptimisticConcurrencyError occurs', async () => {
        // Arrange
        const projectName = 'github.com/testOrg/testName';
        const version = 'feat/something';
        const fileResultModule = createFileResult([MutantStatus.Killed]);
        const moduleResult = createMutationTestResult({ 'a/b': fileResultModule });
        const moduleReport: MutationTestingReport = { moduleName: 'core', mutationScore: 80, projectName, version };
        reportMapperMock.findAll.resolves([{ model: moduleReport, etag: '' }]);
        reportMapperMock.findOne
          .onFirstCall().resolves({ etag: 'old-project-etag', model: moduleReport /* not used */ })
          .onSecondCall().resolves({ etag: 'new-project-etag', model: moduleReport /* not used */ });
        const moduleIdentifier = { version, moduleName: 'core', projectName };
        resultMapperMock.findOne.withArgs(moduleReport).resolves(moduleResult);
        reportMapperMock.replace
          .onFirstCall().rejects(new OptimisticConcurrencyError('OptimisticConcurrencyError for testing'))
          .onSecondCall().resolves();

        // Act
        await sut.saveReport(moduleIdentifier, moduleResult);

        // Act
        const expectedProjectResult = createMutationTestResult({
          'core/a/b': fileResultModule
        });
        const expectedProjectId: ReportIdentifier = { projectName, version, moduleName: undefined };
        const expectedMutationTestingReport: MutationTestingReport = { ...expectedProjectId, mutationScore: 100 };
        expect(resultMapperMock.insertOrMerge).calledWith(expectedProjectId, expectedProjectResult);
        expect(reportMapperMock.replace).calledTwice;
        expect(reportMapperMock.replace).calledWith(expectedMutationTestingReport, 'new-project-etag');
      });
    });
  });

  describe('findOne', () => {

    it('should be able to retrieve a full report', async () => {
      // Arrange
      const id: ReportIdentifier = { moduleName: 'm', projectName: 'p', version: 'v' };
      const result = createMutationTestResult();
      const report = { ...id, mutationScore: 43 };
      resultMapperMock.findOne.resolves(result);
      reportMapperMock.findOne.resolves({ model: report, etag: 'not-used' });

      // Act
      const actual = await sut.findOne(id);

      // Assert
      expect(reportMapperMock.findOne).calledWith(id);
      expect(resultMapperMock.findOne).calledWith(id);
      const expected: Report = { ...report, ...result };
      expect(actual).deep.eq(expected);
    });

    it('should be able to retrieve a mutation-score-only report', async () => {
      // Arrange
      const id: ReportIdentifier = { moduleName: 'm', projectName: 'p', version: 'v' };
      const report = { ...id, mutationScore: 43 };
      resultMapperMock.findOne.resolves(null);
      reportMapperMock.findOne.resolves({ model: report, etag: 'not-used' });

      // Act
      const actual = await sut.findOne(id);

      // Assert
      const expected: Report = report;
      expect(actual).deep.eq(expected);
    });

    it('should resolve null when no report found', async () => {
      // Arrange
      const id: ReportIdentifier = { moduleName: 'm', projectName: 'p', version: 'v' };
      resultMapperMock.findOne.resolves(null);
      reportMapperMock.findOne.resolves(null);

      // Act
      const actual = await sut.findOne(id);

      // Assert
      expect(actual).null;
    });
  });

  function createMutationTestResult(files: FileResultDictionary = createFileResultDictionary(createFileResult())): MutationTestResult {
    return {
      files,
      schemaVersion: '1',
      thresholds: {
        high: 80,
        low: 70
      }
    };
  }

  function createFileResult(mutantStates = [MutantStatus.Killed, MutantStatus.Survived]): FileResult {
    return {
      language: 'javascript',
      source: '+',
      mutants: mutantStates.map((status, index) => ({
        id: index.toString(),
        location: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
        mutatorName: 'BinaryMutator',
        replacement: '-',
        status
      }))
    };
  }
  function createFileResultDictionary(fileResult: FileResult) {
    return {
      'a.js': fileResult
    };
  }
});
