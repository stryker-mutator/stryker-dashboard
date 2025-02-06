import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Project } from '@stryker-mutator/dashboard-data-access';
import { expect } from 'chai';
import type { Response } from 'express';
import sinon from 'sinon';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../../../src/app.module.js';
import RealTimeReportsController from '../../../src/controllers/real-time-reports.controller.js';
import Configuration from '../../../src/services/Configuration.js';
import DataAccess from '../../../src/services/DataAccess.js';
import { MutationEventResponseHandler } from '../../../src/services/real-time/MutationEventResponseHandler.js';
import MutationEventResponseOrchestrator from '../../../src/services/real-time/MutationEventResponseOrchestrator.js';
import utils from '../../../src/utils/utils.js';
import { createMutationTestResult } from '../../helpers/mutants.js';
import { config, DataAccessMock, MutationEventResponseOrchestratorMock } from '../../helpers/TestServer.js';

describe(RealTimeReportsController.name, () => {
  const apiKey = '1346';

  let app: INestApplication<App>;
  let dataAccess: DataAccessMock;
  let removeResponseHandlerStub: sinon.SinonStubbedMember<MutationEventResponseOrchestrator['removeResponseHandler']>;
  let responseHandlerForProjectStub: sinon.SinonStubbedMember<
    MutationEventResponseOrchestrator['createOrGetResponseHandler']
  >;
  let project: Project;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Configuration)
      .useValue(config)
      .overrideProvider(DataAccess)
      .useValue(new DataAccessMock())
      .overrideProvider(MutationEventResponseOrchestrator)
      .useValue(new MutationEventResponseOrchestratorMock())
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('/api');

    dataAccess = app.get<DataAccessMock>(DataAccess);
    dataAccess.blobService.getReport.returns(Promise.resolve([]));

    const orchestrator = app.get<MutationEventResponseOrchestratorMock>(MutationEventResponseOrchestrator);

    removeResponseHandlerStub = orchestrator.removeResponseHandler as sinon.SinonStubbedMember<
      MutationEventResponseOrchestrator['removeResponseHandler']
    >;
    responseHandlerForProjectStub = orchestrator.createOrGetResponseHandler as sinon.SinonStubbedMember<
      MutationEventResponseOrchestrator['createOrGetResponseHandler']
    >;

    project = new Project();
    project.enabled = true;
    project.name = 'stryker';
    project.owner = 'github.com/stryker-mutator';
    project.apiKeyHash = utils.generateHashValue(apiKey);
    dataAccess.repositoryMapper.findOne.resolves({
      model: project,
      etag: 'etag',
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('HTTP GET /*', () => {
    it('should return not found when project does not exist', async () => {
      dataAccess.mutationTestingReportService.findOne.resolves(null);

      const response = await request(app.getHttpServer()).get('/api/real-time/github.com/user/does-not-exist/master');

      expect(response.status).to.eq(404);
    });

    it('should attach itself to the response if the project has been found', async () => {
      const stub = sinon.createStubInstance(MutationEventResponseHandler);
      stub.add.restore();
      sinon.stub(stub, 'add').callsFake((res) => {
        res.end();
      });
      responseHandlerForProjectStub.returns(stub);
      dataAccess.mutationTestingReportService.findOne.resolves({
        files: {},
        schemaVersion: '1',
        thresholds: { high: 80, low: 60 },
        moduleName: 'core',
        projectName: 'github.com/user/exists/',
        version: 'master',
        mutationScore: 89,
      });

      const response = await request(app.getHttpServer()).get('/api/real-time/github.com/user/does-not-exist/master');

      expect(response.status).to.eq(200);
      expect(responseHandlerForProjectStub.calledOnce).to.be.true;
      expect(stub.add.calledOnce);
    });

    it('should get events and replay them', async () => {
      let capturedResponse: Response;
      const stub = sinon.createStubInstance(MutationEventResponseHandler);
      stub.add.restore();
      stub.sendMutantTested.restore();
      sinon.stub(stub, 'add').callsFake((res) => {
        capturedResponse = res.end();
      });
      sinon
        .stub(stub, 'sendMutantTested')
        .onCall(1)
        .callsFake(() => {
          capturedResponse.end();
        });
      responseHandlerForProjectStub.returns(stub);
      dataAccess.mutationTestingReportService.findOne.resolves({
        files: {},
        schemaVersion: '1',
        thresholds: { high: 80, low: 60 },
        moduleName: 'core',
        projectName: 'github.com/user/does-not-exist/',
        version: 'master',
        mutationScore: 89,
      });
      dataAccess.blobService.getReport.returns(
        Promise.resolve([
          { id: '1', status: 'Killed' },
          { id: '2', status: 'Survived' },
        ]),
      );

      await request(app.getHttpServer()).get('/api/real-time/github.com/user/does-not-exist/master');

      sinon.assert.calledWith(dataAccess.blobService.getReport, {
        projectName: 'github.com/user/does-not-exist',
        version: 'master',
        moduleName: undefined,
        realTime: true,
      });
      expect(stub.sendMutantTested.calledTwice).to.be.true;
    });
  });

  describe('HTTP POST /*', () => {
    let serverStub: sinon.SinonStubbedInstance<MutationEventResponseHandler>;

    beforeEach(() => {
      serverStub = sinon.createStubInstance(MutationEventResponseHandler);
      responseHandlerForProjectStub.returns(serverStub);
    });

    it('should return unauthorized if the `X-Api-key` header is not set', async () => {
      const response = await request(app.getHttpServer()).post('/api/real-time/github.com/user/does-exist/master');

      expect(response.status).to.eq(401);
    });

    it('shoud not send any event if no mutant is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send([])
        .expect(201);

      expect(responseHandlerForProjectStub.calledOnce).to.be.true;
      expect(serverStub.sendMutantTested.notCalled).to.be.true;
    });

    it('should return a bad request if null is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send(null as unknown as undefined) // trust me
        .expect(400);
    });

    it('should return a bad request if undefined is sent', async () => {
      await request(app.getHttpServer())
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send(undefined)
        .expect(400);
    });

    it('should send a mutant tested event', async () => {
      await request(app.getHttpServer())
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send([{ id: '1', status: 'Killed' }])
        .expect(201);

      expect(responseHandlerForProjectStub.calledOnce).to.be.true;
      expect(serverStub.sendMutantTested.firstCall.firstArg).to.deep.include({
        id: '1',
        status: 'Killed',
      });
    });
  });

  describe('HTTP PUT /*', () => {
    it('should respond with 200 when uploading a report that is in-progress', async () => {
      // Arrange
      const mutationTestResult = createMutationTestResult();
      mutationTestResult.files['a.js'].mutants[0].status = 'Pending';

      // Act
      const response = await request(app.getHttpServer())
        .put('/api/real-time/github.com/testOrg/testName/myWebsite?module=logging')
        .set('X-Api-Key', apiKey)
        .send(mutationTestResult);

      // Assert
      expect(response.status).eq(200);
      expect(dataAccess.mutationTestingReportService.saveReport.firstCall.firstArg).to.deep.include({
        projectName: 'github.com/testOrg/testName',
        version: 'myWebsite',
        moduleName: 'logging',
        realTime: true,
      });
    });

    it('should create a blob', async () => {
      // Arrange
      const mutationTestResult = createMutationTestResult();
      mutationTestResult.files['a.js'].mutants[0].status = 'Pending';

      // Act
      await request(app.getHttpServer())
        .put('/api/real-time/github.com/testOrg/testName/main?module=logging')
        .set('X-Api-Key', apiKey)
        .send(mutationTestResult);

      // Assert
      sinon.assert.calledWith(dataAccess.blobService.createReport, {
        projectName: 'github.com/testOrg/testName',
        version: 'main',
        moduleName: 'logging',
        realTime: true,
      });
    });

    it('should return a 400 if the report is invalid', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .put('/api/real-time/github.com/testOrg/testName/main?module=logging')
        .set('X-Api-Key', apiKey)
        .send({ my: 'invalid', keys: true });

      // Assert
      expect(response.status).to.eq(400);
    });

    it('should return the correct href with a module', async () => {
      // Arrange
      const report = createMutationTestResult();

      // Act
      const response = await request(app.getHttpServer())
        .put('/api/real-time/github.com/testOrg/testName/main?module=logging')
        .set('X-Api-Key', apiKey)
        .send(report);

      // Arrange
      expect(response.body.href).to.deep.include(
        'baseUrl/reports/github.com/testOrg/testName/main?module=logging&realTime=true',
      );
    });

    it('should return the correct href without a module', async () => {
      // Arrange
      const report = createMutationTestResult();

      // Act
      const response = await request(app.getHttpServer())
        .put('/api/real-time/github.com/testOrg/testName/main')
        .set('X-Api-Key', apiKey)
        .send(report);

      // Arrange
      expect(response.body.href).to.deep.include('baseUrl/reports/github.com/testOrg/testName/main?realTime=true');
    });
  });

  describe('HTTP DELETE /*', () => {
    it('should return unauthorized when header is not present', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/real-time/github.com/testOrg/testName/myWebsite?module=logging',
      );

      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Provide an "X-Api-Key" header');
    });

    it('should return unauthorized if ApiKey is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/real-time/github.com/testOrg/testName/myWebsite?module=logging')
        .set('X-Api-Key', 'does-not-exist-abc');

      expect(response.status).to.eq(401);
    });

    it('should send a finished event', async () => {
      const stub = sinon.createStubInstance(MutationEventResponseHandler);
      responseHandlerForProjectStub.returns(stub);
      const response = await request(app.getHttpServer())
        .delete('/api/real-time/github.com/testOrg/testName/myWebsite?module=logging')
        .set('X-Api-Key', apiKey);

      expect(response.status).to.eq(200);
      expect(responseHandlerForProjectStub.calledOnce).to.be.true;
      sinon.assert.calledWith(responseHandlerForProjectStub, {
        projectName: 'github.com/testOrg/testName',
        version: 'myWebsite',
        moduleName: 'logging',
        realTime: true,
      });
      expect(stub.sendFinished.calledOnce);
      expect(removeResponseHandlerStub.calledOnce).to.be.true;
    });

    it('should delete both blobs', async () => {
      const stub = sinon.createStubInstance(MutationEventResponseHandler);
      responseHandlerForProjectStub.returns(stub);
      await request(app.getHttpServer())
        .delete('/api/real-time/github.com/testOrg/testName/myWebsite?module=logging')
        .set('X-Api-Key', apiKey);

      const expectedId = {
        projectName: 'github.com/testOrg/testName',
        version: 'myWebsite',
        moduleName: 'logging',
        realTime: true,
      };
      expect(dataAccess.blobService.delete.calledOnce).to.be.true;
      sinon.assert.calledWith(dataAccess.blobService.delete, expectedId);
      expect(dataAccess.mutationTestingReportService.delete.calledOnce).to.be.true;
      sinon.assert.calledWith(dataAccess.mutationTestingReportService.delete, expectedId);
    });
  });
});
