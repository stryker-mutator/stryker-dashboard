import ReportsController from '../../../../src/api/ReportsController.js';
import supertest from 'supertest';
import { HTTPError } from 'superagent';
import {
  MutationTestingReportService,
  Project,
  ProjectMapper,
} from '@stryker-mutator/dashboard-data-access';
import {
  MutationTestResult,
  MutantStatus,
} from 'mutation-testing-report-schema';
import { expect } from 'chai';
import utils from '../../../../src/utils.js';
import { Report } from '@stryker-mutator/dashboard-common';
import { PlatformTest } from '@tsed/common';
import Server from '../../../../src/Server.js';
import DataAccess from '../../../../src/services/DataAccess.js';
import sinon from 'sinon';
import { DataAccessMock } from '../../../helpers/TestServer.js';

describe(ReportsController.name, () => {
  let request: supertest.SuperTest<supertest.Test>;
  let findReportStub: sinon.SinonStubbedMember<
    MutationTestingReportService['findOne']
  >;
  let saveReportStub: sinon.SinonStubbedMember<
    MutationTestingReportService['saveReport']
  >;
  let findProjectStub: sinon.SinonStubbedMember<ProjectMapper['findOne']>;

  beforeEach(async () => {
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());

    const dataAccess = PlatformTest.get<DataAccessMock>(DataAccess);
    findReportStub = dataAccess.mutationTestingReportService.findOne;
    saveReportStub = dataAccess.mutationTestingReportService.saveReport;
    findProjectStub = dataAccess.repositoryMapper.findOne;
  });

  describe('HTTP GET /:slug', () => {
    it('should retrieve the expected report', async () => {
      // Arrange
      const expected: Report = {
        ...createMutationTestingResult(),
        moduleName: 'core',
        projectName: 'github.com/fooOrg/fooName',
        version: 'master',
        mutationScore: 89,
      };
      findReportStub.resolves(expected);

      // Act
      const response = await request.get(
        '/api/reports/github.com/owner/name/version'
      );

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq(expected);
    });

    it('should call dissect the correct slug, version and module', async () => {
      await request.get(
        '/api/reports/github.com/test/name/feat/dashboard?module=core'
      );
      expect(findReportStub).calledWith({
        projectName: 'github.com/test/name',
        version: 'feat/dashboard',
        moduleName: 'core',
        realTime: undefined,
      });
    });

    it('should respond with 404 if the report could not be found', async () => {
      const response = await request.get(
        '/api/reports/github.com/owner/name/version'
      );
      expect(response.status).eq(404);
      expect(JSON.parse((response.error as HTTPError).text).message).includes(
        'Version "version" does not exist for "github.com/owner/name".'
      );
    });

    it('should respond with 404 if slug is invalid', async () => {
      const response = await request.get('/api/reports/slugwithoutslash');
      expect(response.status).eq(404);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Report "/slugwithoutslash" does not exist'
      );
    });
  });

  describe('HTTP PUT /:slug', () => {
    const apiKey = '1346';
    let project: Project;

    beforeEach(() => {
      project = new Project();
      project.enabled = true;
      project.name = 'stryker';
      project.owner = 'github.com/stryker-mutator';
      project.apiKeyHash = utils.generateHashValue(apiKey);
      findProjectStub.resolves({
        model: project,
        etag: 'etag',
      });
    });

    it('should save the expected report', async () => {
      // Arrange
      const body = createMutationTestResult([
        MutantStatus.Killed,
        MutantStatus.Survived,
      ]);
      const expectedId = {
        projectName: 'github.com/testOrg/testName',
        version: 'feat/dashboard',
        moduleName: 'core',
        realTime: undefined,
      };

      // Act
      await request
        .put(
          '/api/reports/github.com/testOrg/testName/feat/dashboard?module=core'
        )
        .set('X-Api-Key', apiKey)
        .send(body)
        .expect(200);

      // Assert
      expect(saveReportStub).calledWith(expectedId, body);
    });

    it('should respond with the href link to the report', async () => {
      // Act
      const response = await request
        .put('/api/reports/github.com/testOrg/testName/feat/dashboard')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq({
        href: 'baseUrl/reports/github.com/testOrg/testName/feat/dashboard',
      });
    });

    it("should respond with the href to the project's report when uploading a report with a result for a specific module", async () => {
      // Act
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/myWebsite?module=logging'
        )
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq({
        href: 'baseUrl/reports/github.com/testOrg/testName/myWebsite?module=logging',
        projectHref: 'baseUrl/reports/github.com/testOrg/testName/myWebsite',
      });
    });

    it('should not add the project href to the response when the uploaded report is a mutation score only report', async () => {
      // Act
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/myWebsite?module=logging'
        )
        .set('X-Api-Key', apiKey)
        .send({ mutationScore: 25 });

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq({
        href: 'baseUrl/reports/github.com/testOrg/testName/myWebsite?module=logging',
      });
    });

    it('should respond with 500 internal server error when update rejects', async () => {
      // Arrange
      const expectedError = new Error('Connection error');
      saveReportStub.rejects(expectedError);

      // Act
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/feat/dashboard?module=core'
        )
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(500);
      expect(response.text).includes('Internal server error');
    });

    it('should respond with 401 when X-Api-Key header is missing', async () => {
      const response = await request.put(
        '/api/reports/github.com/testOrg/testName/feat/dashboard'
      );
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Provide an "X-Api-Key" header'
      );
    });

    it("should respond with 401 when the api key doesn't match", async () => {
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/feat/dashboard?module=core'
        )
        .set('X-Api-Key', 'wrong key');
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Invalid API key'
      );
    });

    it('should respond with 400 when uploading a report that is in-progress', async () => {
      // Arrange
      const mutationTestResult = createMutationTestResult();
      // This action marks it in progress
      mutationTestResult.files['a.js'].mutants[0].status = MutantStatus.Pending;

      // Act
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/myWebsite?module=logging'
        )
        .set('X-Api-Key', apiKey)
        .send(mutationTestResult);

      // Assert
      expect(response.status).eq(400);
    });

    it('should not respond with 400 when uploading a report that is in-progress', async () => {
      // Arrange
      const mutationTestResult = createMutationTestResult();
      // This action marks it in progress
      mutationTestResult.files['a.js'].mutants[0].status = MutantStatus.Pending;

      // Act
      const response = await request
        .put(
          '/api/reports/github.com/testOrg/testName/myWebsite?module=logging&realtime=true'
        )
        .set('X-Api-Key', apiKey)
        .send(mutationTestResult);

      // Assert
      expect(response.status).eq(400);
    });
  });

  function createMutationTestResult(
    mutantStates = [
      MutantStatus.Killed,
      MutantStatus.Killed,
      MutantStatus.Survived,
    ]
  ): MutationTestResult {
    return {
      files: {
        'a.js': {
          language: 'javascript',
          source: '+',
          mutants: mutantStates.map((status, index) => ({
            id: index.toString(),
            location: {
              start: { line: 1, column: 1 },
              end: { line: 1, column: 2 },
            },
            mutatorName: 'BinaryMutator',
            replacement: '-',
            status,
          })),
        },
      },
      schemaVersion: '1',
      thresholds: {
        high: 80,
        low: 70,
      },
    };
  }

  function createMutationTestingResult(): MutationTestResult {
    return {
      files: {},
      schemaVersion: '1',
      thresholds: { high: 80, low: 60 },
    };
  }
});
