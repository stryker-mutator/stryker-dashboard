import ReportsController from '../../../src/api/ReportsController';
import supertest = require('supertest');
import testServer, { DataAccessStub } from '../../helpers/TestServer';
import { MutationTestingReport, Project } from 'stryker-dashboard-data-access';
import { expect } from 'chai';
import { generateHashValue } from '../../../src/utils';
import sinon = require('sinon');

describe(ReportsController.name, () => {
  let request: supertest.SuperTest<supertest.Test>;
  let errorLog: sinon.SinonStub;

  beforeEach(async () => {
    request = await testServer(ReportsController, undefined);
    errorLog = sinon.stub(console, 'error');
  });

  describe('HTTP GET /:slug', () => {
    it('should retrieve the expected report', async () => {
      // Arrange
      const expected = createMutationTestingReport();
      DataAccessStub.mutationTestingReportMapper.findOne.resolves(expected);

      // Act
      const response = await request.get('/reports/github.com/test/name');

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq(expected);
    });

    it('should call dissect the correct repositorySlug, version and module', async () => {
      await request.get('/reports/github.com/test/name/feat%2Fdashboard?module=core');
      expect(DataAccessStub.mutationTestingReportMapper.findOne).calledWith({
        repositorySlug: 'github.com/test/name',
        version: 'feat%2Fdashboard',
        moduleName: 'core'
      });
    });

    it('should respond with 404 if the report could not be found', async () => {
      const response = await request.get('/reports/github.com/test/');
      expect(response.status).eq(404);
      expect(response.error.text).include('Report "github.com/test" does not exist');
    });

    it('should respond with 404 if slug is invalid', async () => {
      const response = await request.get('/reports/slugwithoutslash');
      expect(response.status).eq(404);
      expect(response.error.text).include('Invalid slug "/slugwithoutslash"');
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
      project.apiKeyHash = generateHashValue(apiKey);
      DataAccessStub.repositoryMapper.findOne.resolves(project);
    });

    it('should update the expected report using the score from metrics', async () => {
      // Arrange
      const body = createMutationTestingReport();

      // Act
      await request
        .put('/reports/github.com/test/feat%2Fdashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(body);

      // Assert
      const expectedMutationTestingReport: MutationTestingReport = {
        version: 'feat%2Fdashboard',
        result: body.result,
        mutationScore: 100, // 0 files, so a score of 100%
        moduleName: 'core',
        repositorySlug: 'github.com/test'
      };
      expect(DataAccessStub.mutationTestingReportMapper.insertOrMergeEntity).calledWith(expectedMutationTestingReport);
    });

    it('should respond with the href link to the report', async () => {
      // Act
      const response = await request
        .put('/reports/github.com/test/feat%2Fdashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestingReport());

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq({
        href: 'base url/reports/github.com/test/feat%2Fdashboard?module=core'
      });
    });

    it('should respond with 500 internal server error when update rejects', async () => {
      // Arrange
      const expectedError = new Error('Connection error');
      DataAccessStub.mutationTestingReportMapper.insertOrMergeEntity.rejects(expectedError);

      // Act
      const response = await request
        .put('/reports/github.com/test/feat%2Fdashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestingReport());

      // Assert
      expect(response.status).eq(500);
      expect(response.text).eq('Internal server error');
      expect(errorLog).calledWith('Error while trying to save report', sinon.match.object, expectedError);
    });

    it('should respond with 401 when X-Api-Key header is missing', async () => {
      const response = await request
        .put('/reports/github.com/test/feat%2Fdashboard?module=core');
      expect(response.status).eq(401);
      expect(response.error.text).include('Provide an "X-Api-Key" header');
    });

    it('should respond with 401 when the api key doesn\'t match', async () => {
      const response = await request
        .put('/reports/github.com/test/feat%2Fdashboard?module=core')
        .set('X-Api-Key', 'wrong key');
      expect(response.status).eq(401);
      expect(response.error.text).include('Invalid API key');
    });
  });

  function createMutationTestingReport(): MutationTestingReport {
    return {
      moduleName: 'moduleName',
      mutationScore: 89,
      repositorySlug: 'github.com/example/org',
      result: {
        files: {},
        schemaVersion: '1',
        thresholds: { high: 80, low: 60 }
      },
      version: 'master'
    };
  }
});
