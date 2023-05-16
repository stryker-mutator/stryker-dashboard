import supertest from 'supertest';
import RealtimeUpdatesController from '../../../src/api/RealtimeUpdatesController.js';
import { PlatformTest } from '@tsed/common';
import Server from '../../../src/Server.js';
import sinon from 'sinon';
import {
  MutationTestingReportService,
  Project,
  ProjectMapper,
} from '@stryker-mutator/dashboard-data-access';
import {
  DataAccessMock,
  MutationtEventServerOrchestratorMock,
} from '../../helpers/TestServer.js';
import DataAccess from '../../../src/services/DataAccess.js';
import { expect } from 'chai';
import MutationtEventServerOrchestrator from '../../../src/services/real-time/MutationtEventServerOrchestrator.js';
import { MutationEventServer } from '../../../src/services/real-time/MutationEventServer.js';
import utils from '../../../src/utils.js';
import { MutantStatus } from 'mutation-testing-report-schema';

describe(RealtimeUpdatesController.name, () => {
  let request: supertest.SuperTest<supertest.Test>;
  let findReportStub: sinon.SinonStubbedMember<
    MutationTestingReportService['findOne']
  >;
  let findProjectStub: sinon.SinonStubbedMember<ProjectMapper['findOne']>;
  let sseInstanceForProjectStub: sinon.SinonStubbedMember<
    MutationtEventServerOrchestrator['getSseInstanceForProject']
  >;

  beforeEach(async () => {
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());

    const dataAccess = PlatformTest.get<DataAccessMock>(DataAccess);
    findReportStub = dataAccess.mutationTestingReportService.findOne;
    findProjectStub = dataAccess.repositoryMapper.findOne;

    const orchestrator = PlatformTest.get<MutationtEventServerOrchestratorMock>(
      MutationtEventServerOrchestrator
    );
    sseInstanceForProjectStub =
      orchestrator.getSseInstanceForProject as sinon.SinonStubbedMember<
        MutationtEventServerOrchestrator['getSseInstanceForProject']
      >;
  });

  describe('HTTP GET /*', () => {
    it('should return not found when project does not exist', async () => {
      findReportStub.resolves(null);

      const response = await request.get(
        '/api/real-time/github.com/user/does-not-exist/master'
      );

      expect(response.status).to.eq(404);
    });

    it('should attach itself to the response if the project has been found', async () => {
      const stub = sinon.createStubInstance(MutationEventServer);
      sseInstanceForProjectStub.returns(stub);
      findReportStub.resolves({
        files: {},
        schemaVersion: '1',
        thresholds: { high: 80, low: 60 },
        moduleName: 'core',
        projectName: 'github.com/user/exists/',
        version: 'master',
        mutationScore: 89,
      });

      const response = await request.get(
        '/api/real-time/github.com/user/does-not-exist/master'
      );

      expect(response.status).to.eq(200);
      expect(sseInstanceForProjectStub.calledOnce).to.be.true;
      expect(stub.attach.calledOnce);
    });
  });

  describe('HTTP POST /:github/:project/:version', () => {
    const apiKey = '1346';

    let serverStub: sinon.SinonStubbedInstance<MutationEventServer>;
    let project: Project;

    beforeEach(() => {
      serverStub = sinon.createStubInstance(MutationEventServer);
      sseInstanceForProjectStub.returns(serverStub);

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

    it('should return unauthorized if the `X-Api-key` header is not set', async () => {
      const response = await request.post(
        '/api/real-time/github.com/user/does-exist/master'
      );

      expect(response.status).to.eq(401);
    });

    it('shoud not send any event if no mutant is sent', async () => {
      await request
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send([])
        .expect(200);

      expect(sseInstanceForProjectStub.calledOnce).to.be.true;
      expect(serverStub.sendMutantTested.notCalled).to.be.true;
    });

    it('should return a bad request if an object is sent', async () => {
      await request
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send({ id: '1', status: MutantStatus.Killed })
        .expect(400);
    });

    it('should return a bad request if null is sent', async () => {
      await request
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send(null as unknown as undefined) // trust me
        .expect(400);
    });

    it('should return a bad request if undefined is sent', async () => {
      await request
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send(undefined)
        .expect(400);
    });

    it('should send a mutant tested for every client connected', async () => {
      await request
        .post('/api/real-time/github.com/user/does-not-exist/master')
        .set('X-Api-Key', apiKey)
        .send([{ id: '1', status: MutantStatus.Killed }])
        .expect(200);

      expect(sseInstanceForProjectStub.calledOnce).to.be.true;
      expect(serverStub.sendMutantTested.firstCall.firstArg).to.deep.include({
        id: '1',
        status: MutantStatus.Killed,
      });
    });
  });
});
