import ReportsController from '../../../src/api/ReportsController';
import supertest = require('supertest');
import testServer, { DataAccessStub } from '../../helpers/TestServer';
import { Project } from '@stryker-mutator/dashboard-data-access';
import { MutationTestResult, MutantStatus } from 'mutation-testing-report-schema';
import { expect } from 'chai';
import { generateHashValue } from '../../../src/utils';
import sinon = require('sinon');
import { Report } from '@stryker-mutator/dashboard-common';

describe(ReportsController.name, () => {
  let request: supertest.SuperTest<supertest.Test>;
  let errorLog: sinon.SinonStub;

  beforeEach(async () => {
    request = await testServer(ReportsController);
    errorLog = sinon.stub(console, 'error');
  });

  describe('HTTP GET /:slug', () => {
    it('should retrieve the expected report', async () => {
      // Arrange
      const expected: Report = {
        ...createMutationTestingResult(),
        moduleName: 'core',
        projectName: 'github.com/fooOrg/fooName',
        version: 'master',
        mutationScore: 89
      };
      DataAccessStub.mutationTestingReportService.findOne.resolves(expected);

      // Act
      const response = await request.get('/reports/github.com/owner/name/version');

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq(expected);
    });

    it('should call dissect the correct slug, version and module', async () => {
      await request.get('/reports/github.com/test/name/feat/dashboard?module=core');
      expect(DataAccessStub.mutationTestingReportService.findOne).calledWith({
        projectName: 'github.com/test/name',
        version: 'feat/dashboard',
        moduleName: 'core'
      });
    });

    it('should respond with 404 if the report could not be found', async () => {
      const response = await request.get('/reports/github.com/owner/name/version');
      expect(response.status).eq(404);
      expect(response.error.text).include('Version "version" does not exist for "github.com/owner/name".');
    });

    it('should respond with 404 if slug is invalid', async () => {
      const response = await request.get('/reports/slugwithoutslash');
      expect(response.status).eq(404);
      expect(response.error.text).include('Report "/slugwithoutslash" does not exist');
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
      DataAccessStub.repositoryMapper.findOne.resolves({ model: project, etag: 'etag' });
    });

    it('should save the expected report', async () => {
      // Arrange
      const body = createMutationTestResult([MutantStatus.Killed, MutantStatus.Survived]);
      const expectedId = { projectName: 'github.com/testOrg/testName', version: 'feat/dashboard', moduleName: 'core' };

      // Act
      await request
        .put('/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(body);

      // Assert
      expect(DataAccessStub.mutationTestingReportService.saveReport).calledWith(expectedId, body);
    });

    it('should respond with the href link to the report', async () => {
      // Act
      const response = await request
        .put('/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq({
        href: 'base url/reports/github.com/testOrg/testName/feat/dashboard?module=core'
      });
    });

    it('should respond with 500 internal server error when update rejects', async () => {
      // Arrange
      const expectedError = new Error('Connection error');
      DataAccessStub.mutationTestingReportService.saveReport.rejects(expectedError);

      // Act
      const response = await request
        .put('/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(500);
      expect(response.text).eq('Internal server error');
      expect(errorLog).calledWith('Error while trying to save report {"project":"github.com/testOrg/testName","version":"feat/dashboard","moduleName":"core"}', expectedError);
    });

    it('should respond with 401 when X-Api-Key header is missing', async () => {
      const response = await request
        .put('/reports/github.com/testOrg/testName/feat/dashboard');
      expect(response.status).eq(401);
      expect(response.error.text).include('Provide an "X-Api-Key" header');
    });

    it('should respond with 401 when the api key doesn\'t match', async () => {
      const response = await request
        .put('/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', 'wrong key');
      expect(response.status).eq(401);
      expect(response.error.text).include('Invalid API key');
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
            location: { start: { line: 1, column: 1}, end: { line: 1, column: 2 }},
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

  function createMutationTestingResult(): MutationTestResult {
    return {
      files: {},
      schemaVersion: '1',
      thresholds: { high: 80, low: 60 }
    };
  }
});
