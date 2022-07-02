import { expect } from 'chai';
import { MutantStatus } from 'mutation-testing-report-schema';
import sinon from 'sinon';
import { MutationTestingReport } from '../../../src/models/index.js';
import {
  MutationTestingReportMapper,
  OptimisticConcurrencyError,
} from '../../../src/index.js';
import { MutationTestingResultMapper } from '../../../src/mappers/MutationTestingResultMapper.js';
import { MutationTestingReportService } from '../../../src/services/MutationTestingReportService.js';
import {
  createTableMapperMock,
  createMutationTestResult,
  createFileResult,
  createFileResultDictionary,
} from '../../helpers/mock.js';
import {
  ReportIdentifier,
  Report,
  Logger,
} from '@stryker-mutator/dashboard-common';
import { aggregateResultsByModule } from 'mutation-testing-metrics';

describe(MutationTestingReportService.name, () => {
  let sut: MutationTestingReportService;
  let reportMapperMock: sinon.SinonStubbedInstance<MutationTestingReportMapper>;
  let resultMapperMock: sinon.SinonStubbedInstance<MutationTestingResultMapper>;
  let logger: sinon.SinonStubbedInstance<Logger>;

  beforeEach(() => {
    logger = {
      debug: sinon.stub(),
      info: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub(),
    };
    reportMapperMock = createTableMapperMock();
    resultMapperMock = sinon.createStubInstance(MutationTestingResultMapper);
    sut = new MutationTestingReportService(
      resultMapperMock as unknown as MutationTestingResultMapper,
      reportMapperMock
    );
  });

  describe('createStorageIfNotExists', () => {
    it('should create storage for underlying mappers', async () => {
      await sut.createStorageIfNotExists();
      expect(reportMapperMock.createStorageIfNotExists).called;
      expect(resultMapperMock.createStorageIfNotExists).called;
    });
  });

  describe('saveReport', () => {
    it('should update the expected report using the score from metrics', async () => {
      // Arrange
      const expectedResult = createMutationTestResult(
        createFileResultDictionary(
          createFileResult([MutantStatus.Killed, MutantStatus.Survived])
        )
      );
      const reportIdentifier = {
        version: 'feat/dashboard',
        moduleName: undefined,
        projectName: 'github.com/testOrg/testName',
      };
      const expectedMutationTestingReport: MutationTestingReport = {
        ...reportIdentifier,
        mutationScore: 50, // 1 Survived, 1 Killed
      };

      // Act
      await sut.saveReport(reportIdentifier, expectedResult, logger);

      // Assert
      expect(reportMapperMock.insertOrMerge).calledWith(
        expectedMutationTestingReport
      );
      expect(resultMapperMock.insertOrReplace).calledWith(
        reportIdentifier,
        expectedResult
      );
    });

    it('should not normalize file names in the report', async () => {
      // Arrange
      const rawResult = Object.freeze(
        createMutationTestResult({
          ['a/b/c/d']: createFileResult(),
          ['a/b/e/f']: createFileResult(),
        })
      );
      const reportIdentifier = {
        version: 'feat/dashboard',
        moduleName: undefined,
        projectName: 'github.com/testOrg/testName',
      };

      // Act
      await sut.saveReport(reportIdentifier, rawResult, logger);

      // Assert
      expect(resultMapperMock.insertOrReplace).calledWith(
        reportIdentifier,
        rawResult
      );
    });

    it('should support a score-only-report', async () => {
      // Arrange
      const expectedMutationScore = 81;
      const expectedResult = {
        mutationScore: expectedMutationScore,
      };
      const reportIdentifier = {
        version: 'feat/dashboard',
        moduleName: 'core',
        projectName: 'github.com/testOrg/testName',
      };

      // Act
      await sut.saveReport(reportIdentifier, expectedResult, logger);

      // Assert
      const expectedMutationTestingReport: MutationTestingReport = {
        version: 'feat/dashboard',
        mutationScore: expectedMutationScore,
        moduleName: 'core',
        projectName: 'github.com/testOrg/testName',
      };
      expect(reportMapperMock.insertOrMerge).calledWith(
        expectedMutationTestingReport
      );
      expect(resultMapperMock.insertOrReplace).calledWith(
        reportIdentifier,
        null
      );
    });

    describe('for a module in a project', () => {
      it("should aggregate the project's report", async () => {
        // Arrange
        const projectName = 'github.com/testOrg/testName';
        const version = 'feat/something';
        const coreResult = createMutationTestResult({
          'a/b': createFileResult([MutantStatus.Killed]),
        });
        const apiResult = createMutationTestResult({
          'a/b': createFileResult([MutantStatus.NoCoverage]),
        });
        const coreReport: MutationTestingReport = {
          moduleName: 'core',
          mutationScore: 80,
          projectName,
          version,
        };
        const apiReport: MutationTestingReport = {
          moduleName: 'api',
          mutationScore: 80,
          projectName,
          version,
        };
        reportMapperMock.findAll.resolves([
          { model: coreReport, etag: '' },
          { model: apiReport, etag: '' },
        ]);
        reportMapperMock.findOne.resolves({
          etag: 'old-project-etag',
          model: coreReport /* not used */,
        });
        const module1Identifier = { version, moduleName: 'core', projectName };
        resultMapperMock.findOne
          .withArgs(coreReport)
          .resolves(coreResult)
          .withArgs(apiReport)
          .resolves(apiResult);

        // Act
        await sut.saveReport(module1Identifier, coreResult, logger);

        // Act
        const expectedProjectResult = aggregateResultsByModule({
          core: coreResult,
          api: apiResult,
        });
        const expectedProjectId: ReportIdentifier = {
          projectName,
          version,
          moduleName: undefined,
        };
        const expectedMutationTestingReport: MutationTestingReport = {
          ...expectedProjectId,
          mutationScore: 50,
        }; // one killed and one noCoverage
        expect(resultMapperMock.insertOrReplace).calledWith(
          expectedProjectId,
          expectedProjectResult
        );
        expect(reportMapperMock.replace).calledWith(
          expectedMutationTestingReport,
          'old-project-etag'
        );
      });

      it('should retry the projects report when an OptimisticConcurrencyError occurs', async () => {
        // Arrange
        const projectName = 'github.com/testOrg/testName';
        const version = 'feat/something';
        const moduleResult = createMutationTestResult({
          'a/b': createFileResult([MutantStatus.Killed]),
        });
        const moduleReport: MutationTestingReport = {
          moduleName: 'core',
          mutationScore: 80,
          projectName,
          version,
        };
        reportMapperMock.findAll.resolves([{ model: moduleReport, etag: '' }]);
        reportMapperMock.findOne
          .onFirstCall()
          .resolves({
            etag: 'old-project-etag',
            model: moduleReport /* not used */,
          })
          .onSecondCall()
          .resolves({
            etag: 'new-project-etag',
            model: moduleReport /* not used */,
          });
        const moduleIdentifier = { version, moduleName: 'core', projectName };
        resultMapperMock.findOne.withArgs(moduleReport).resolves(moduleResult);
        reportMapperMock.replace
          .onFirstCall()
          .rejects(
            new OptimisticConcurrencyError(
              'OptimisticConcurrencyError for testing'
            )
          )
          .onSecondCall()
          .resolves();

        // Act
        await sut.saveReport(moduleIdentifier, moduleResult, logger);

        // Act
        const expectedProjectResult = aggregateResultsByModule({
          core: moduleResult,
        });
        const expectedProjectId: ReportIdentifier = {
          projectName,
          version,
          moduleName: undefined,
        };
        const expectedMutationTestingReport: MutationTestingReport = {
          ...expectedProjectId,
          mutationScore: 100,
        };
        expect(resultMapperMock.insertOrReplace).calledWith(
          expectedProjectId,
          expectedProjectResult
        );
        expect(reportMapperMock.replace).calledTwice;
        expect(reportMapperMock.replace).calledWith(
          expectedMutationTestingReport,
          'new-project-etag'
        );
        expect(logger.info).calledWith({
          message: `Optimistic concurrency exception occurred while trying to aggregate the report ${JSON.stringify(
            expectedProjectId
          )}, retrying...`,
        });
      });

      it('should retry the projects report when an OptimisticConcurrencyError occurs on storing the result', async () => {
        // Arrange
        const projectName = 'github.com/testOrg/testName';
        const version = 'feat/something';
        const moduleResult = createMutationTestResult({
          'a/b': createFileResult([MutantStatus.Killed]),
        });
        const moduleReport: MutationTestingReport = {
          moduleName: 'core',
          mutationScore: 80,
          projectName,
          version,
        };
        reportMapperMock.findAll.resolves([{ model: moduleReport, etag: '' }]);
        reportMapperMock.findOne.resolves({
          etag: 'project-etag',
          model: moduleReport /* not used */,
        });
        const moduleIdentifier = { version, moduleName: 'core', projectName };
        const expectedProjectId: ReportIdentifier = {
          projectName,
          version,
          moduleName: undefined,
        };
        resultMapperMock.findOne.resolves(moduleResult);
        resultMapperMock.insertOrReplace
          .withArgs(moduleIdentifier, sinon.match.object)
          .resolves()
          .withArgs(expectedProjectId, sinon.match.object)
          .onFirstCall()
          .rejects(new OptimisticConcurrencyError())
          .onSecondCall()
          .resolves();
        reportMapperMock.replace.resolves();

        // Act
        await sut.saveReport(moduleIdentifier, moduleResult, logger);

        // Act
        const expectedProjectResult = aggregateResultsByModule({
          core: moduleResult,
        });
        const expectedMutationTestingReport: MutationTestingReport = {
          ...expectedProjectId,
          mutationScore: 100,
        };
        expect(resultMapperMock.insertOrReplace).calledThrice;
        expect(resultMapperMock.insertOrReplace).calledWith(
          expectedProjectId,
          expectedProjectResult
        );
        expect(reportMapperMock.replace).calledOnce;
        expect(reportMapperMock.replace).calledWith(
          expectedMutationTestingReport,
          'project-etag'
        );
      });
    });
  });

  describe('findOne', () => {
    it('should be able to retrieve a full report', async () => {
      // Arrange
      const id: ReportIdentifier = {
        moduleName: 'm',
        projectName: 'p',
        version: 'v',
      };
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
      const id: ReportIdentifier = {
        moduleName: 'm',
        projectName: 'p',
        version: 'v',
      };
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
      const id: ReportIdentifier = {
        moduleName: 'm',
        projectName: 'p',
        version: 'v',
      };
      resultMapperMock.findOne.resolves(null);
      reportMapperMock.findOne.resolves(null);

      // Act
      const actual = await sut.findOne(id);

      // Assert
      expect(actual).null;
    });
  });
});
