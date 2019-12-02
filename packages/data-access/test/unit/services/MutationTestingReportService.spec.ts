import { expect } from 'chai';
import { MutantStatus, MutationTestResult } from 'mutation-testing-report-schema';
import sinon = require('sinon');
import MutationTestingReport from '../../../src/models/MutationTestingReport';
import { MutationTestingReportMapper } from '../../../src/';
import { MutationTestingResultMapper } from '../../../src/mappers/MutationTestingResultMapper';
import { MutationTestingReportService } from '../../../src/services/MutationTestingReportService';

describe(MutationTestingReportService.name, () => {

  let sut: MutationTestingReportService;
  let reportMapperMock: sinon.SinonStubbedInstance<MutationTestingReportMapper>;
  let resultMapperMock: sinon.SinonStubbedInstance<MutationTestingResultMapper>;

  beforeEach(() => {
    reportMapperMock = {
      createStorageIfNotExists: sinon.stub(),
      findOne: sinon.stub(),
      insertOrMergeEntity: sinon.stub(),
      findAll: sinon.stub(),
    };
    resultMapperMock = sinon.createStubInstance(MutationTestingResultMapper);
    sut = new MutationTestingReportService(resultMapperMock as unknown as MutationTestingResultMapper, reportMapperMock);
  });

  describe('saveReport', () => {

    it('should update the expected report using the score from metrics', async () => {
      // Arrange
      const expectedResult = createMutationTestResult([MutantStatus.Killed, MutantStatus.Survived]);
      const reportIdentifier = { version: 'feat/dashboard', moduleName: 'core', projectName: 'github.com/testOrg/testName' };
      const expectedMutationTestingReport: MutationTestingReport = {
        ...reportIdentifier,
        mutationScore: 50, // 1 Survived, 1 Killed
      };

      // Act
      await sut.saveReport(reportIdentifier, expectedResult);

      // Assert
      expect(reportMapperMock.insertOrMergeEntity).calledWith(expectedMutationTestingReport);
      expect(resultMapperMock.insertOrMergeEntity).calledWith(reportIdentifier, expectedResult);
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
      expect(reportMapperMock.insertOrMergeEntity).calledWith(expectedMutationTestingReport);
      expect(resultMapperMock.insertOrMergeEntity).calledWith(reportIdentifier, null);
    });
  });

  function createMutationTestResult(mutantStates = [MutantStatus.Killed, MutantStatus.Killed, MutantStatus.Survived]): MutationTestResult {
    return {
      files: {
        'a.js': {
          language: 'javascript',
          source: '+',
          mutants: mutantStates.map((status, index) => ({
            id: index.toString(),
            location: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
            mutatorName: 'BinaryMutator',
            replacement: '-',
            status
          }))
        }
      },
      schemaVersion: '1',
      thresholds: {
        high: 80,
        low: 70
      }
    };
  }

});
