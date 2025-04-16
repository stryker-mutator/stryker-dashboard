import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Report } from '@stryker-mutator/dashboard-common';
import type { MutationTestingReportService, ProjectMapper } from '@stryker-mutator/dashboard-data-access';
import { Project } from '@stryker-mutator/dashboard-data-access';
import { expect } from 'chai';
import sinon from 'sinon';
import type { HTTPError } from 'superagent';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../../../src/app.module.js';
import ReportsController from '../../../src/controllers/reports.controller.js';
import Configuration from '../../../src/services/Configuration.js';
import DataAccess from '../../../src/services/DataAccess.js';
import utils from '../../../src/utils/utils.js';
import { createMutationTestingResult, createMutationTestResult } from '../../helpers/mutants.js';
import { config, DataAccessMock } from '../../helpers/TestServer.js';

describe(ReportsController.name, () => {
  let app: INestApplication<App>;
  let findReportStub: sinon.SinonStubbedMember<MutationTestingReportService['findOne']>;
  let saveReportStub: sinon.SinonStubbedMember<MutationTestingReportService['saveReport']>;
  let findProjectStub: sinon.SinonStubbedMember<ProjectMapper['findOne']>;
  let deleteReportStub: sinon.SinonStubbedMember<MutationTestingReportService['delete']>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Configuration)
      .useValue(config)
      .overrideProvider(DataAccess)
      .useValue(new DataAccessMock())
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('/api');

    const dataAccess = app.get<DataAccessMock>(DataAccess);
    findReportStub = dataAccess.mutationTestingReportService.findOne;
    saveReportStub = dataAccess.mutationTestingReportService.saveReport;
    findProjectStub = dataAccess.repositoryMapper.findOne;
    deleteReportStub = dataAccess.mutationTestingReportService.delete;

    await app.init();
  });

  afterEach(async () => {
    await app.close();
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
      const response = await request(app.getHttpServer()).get('/api/reports/github.com/owner/name/version');

      // Assert
      expect(response.status).eq(200);
      expect(response.body).deep.eq(expected);
    });

    it('should call dissect the correct slug, version and module', async () => {
      await request(app.getHttpServer()).get('/api/reports/github.com/test/name/feat/dashboard?module=core');
      sinon.assert.calledWith(findReportStub, {
        projectName: 'github.com/test/name',
        version: 'feat/dashboard',
        moduleName: 'core',
      });
    });

    it('should respond with 404 if the report could not be found', async () => {
      const response = await request(app.getHttpServer()).get('/api/reports/github.com/owner/name/version');
      expect(response.status).eq(404);
      expect(JSON.parse((response.error as HTTPError).text).message).includes(
        'Version "version" does not exist for "github.com/owner/name".',
      );
    });

    it('should respond with 404 if slug is invalid', async () => {
      const response = await request(app.getHttpServer()).get('/api/reports/slugwithoutslash');
      expect(response.status).eq(404);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Report "slugwithoutslash" does not exist',
      );
    });

    it('should respond with a stable report if there is no real-time report', async () => {
      const expected: Report = {
        ...createMutationTestingResult(),
        moduleName: 'core',
        projectName: 'github.com/fooOrg/fooName',
        version: 'master',
        mutationScore: 89,
      };
      findReportStub.onCall(0).returns(Promise.resolve(null));
      findReportStub.onCall(1).returns(Promise.resolve(expected));

      const response = await request(app.getHttpServer()).get(
        '/api/reports/github.com/owner/name/version?realTime=true',
      );

      expect(response.status).eq(200);
      expect(response.body).deep.eq(expected);
    });

    it('should respond with 404 if there is no stable report and no real-time report', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/reports/github.com/owner/name/version?realTime=true',
      );

      expect(response.status).eq(404);
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
      const body = createMutationTestResult(['Killed', 'Survived']);
      const expectedId = {
        projectName: 'github.com/testOrg/testName',
        version: 'feat/dashboard',
        moduleName: 'core',
      };

      // Act
      await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(body)
        .expect(200);

      // Assert
      sinon.assert.calledWith(saveReportStub, expectedId, body);
    });

    it('should respond with the href link to the report', async () => {
      // Act
      const response = await request(app.getHttpServer())
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
      const response = await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/myWebsite?module=logging')
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
      const response = await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/myWebsite?module=logging')
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
      const response = await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .send(createMutationTestResult());

      // Assert
      expect(response.status).eq(500);
      expect(response.text).includes('Internal server error');
    });

    it('should respond with 401 when X-Api-Key header is missing', async () => {
      const response = await request(app.getHttpServer()).put(
        '/api/reports/github.com/testOrg/testName/feat/dashboard',
      );
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Provide a valid "X-Api-Key" or JWT authorization header',
      );
    });

    it("should respond with 401 when the api key doesn't match", async () => {
      const response = await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', 'wrong key');
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include('Provide a valid "X-Api-Key"');
    });

    it('should respond with 400 when uploading a report that is in-progress', async () => {
      // Arrange
      const mutationTestResult = createMutationTestResult();
      mutationTestResult.files['a.js'].mutants[0].status = 'Pending';

      // Act
      const response = await request(app.getHttpServer())
        .put('/api/reports/github.com/testOrg/testName/myWebsite?module=logging')
        .set('X-Api-Key', apiKey)
        .send(mutationTestResult);

      // Assert
      expect(response.status).eq(400);
    });
  });

  describe('HTTP DELETE /:slug', () => {
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

    it('should delete the expected report', async () => {
      // Act
      await request(app.getHttpServer())
        .delete('/api/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey)
        .expect(204);

      // Assert
      sinon.assert.calledWith(findProjectStub, {
        owner: 'github.com/testOrg',
        name: 'testName',
      });
      sinon.assert.calledWith(deleteReportStub, {
        projectName: 'github.com/testOrg/testName',
        version: 'feat/dashboard',
        moduleName: 'core',
      });
    });

    it('should return 401 when the X-Api-Key header is missing', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/reports/github.com/testOrg/testName/feat/dashboard',
      );
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include(
        'Provide a valid "X-Api-Key" or JWT authorization header',
      );
    });

    it('should return 401 when the api key is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/reports/github.com/testOrg/testName/feat/dashboard')
        .set('X-Api-Key', 'invalid key');
      expect(response.status).eq(401);
      expect(JSON.parse((response.error as HTTPError).text).message).include('Provide a valid "X-Api-Key"');
    });

    it('should return 500 when the delete operation fails', async () => {
      // Arrange
      deleteReportStub.rejects(new Error('Failed to delete'));

      // Act
      const response = await request(app.getHttpServer())
        .delete('/api/reports/github.com/testOrg/testName/feat/dashboard?module=core')
        .set('X-Api-Key', apiKey);

      // Assert
      expect(response.status).eq(500);
      expect(response.text).includes('Internal server error');
    });
  });
});
