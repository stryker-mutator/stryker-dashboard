import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import sinon from 'sinon';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../../../src/app.module.js';
import type * as github from '../../../src/github/models.js';
import Configuration from '../../../src/services/Configuration.js';
import DataAccess from '../../../src/services/DataAccess.js';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';
import utils from '../../../src/utils/utils.js';
import { githubFactory } from '../../helpers/producers.js';
import { config, createAuthorizationHeader, DataAccessMock } from '../../helpers/TestServer.js';

describe('RepositoriesController', () => {
  let app: INestApplication<App>;
  let generateHashStub: sinon.SinonStubbedMember<typeof utils.generateHashValue>;
  let generateApiKeyStub: sinon.SinonStubbedMember<typeof utils.generateApiKey>;
  let updateStub: sinon.SinonStubbedMember<GithubRepositoryService['update']>;
  let auth: github.Authentication;
  let authToken: string;

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

    auth = githubFactory.authentication({
      accessToken: 'foobar access token',
      username: 'user',
    });
    authToken = await createAuthorizationHeader(auth);
    generateApiKeyStub = sinon.stub(utils, 'generateApiKey');
    generateHashStub = sinon.stub(utils, 'generateHashValue');
    const githubRepositoryService = app.get<GithubRepositoryService>(GithubRepositoryService);
    updateStub = sinon.stub(githubRepositoryService, 'update');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('PATCH /github/:owner/:name', () => {
    it('should enable the repository with a new api key if enabled = true', async () => {
      updateStub.resolves();
      generateHashStub.returns('hashed api key');
      generateApiKeyStub.returns('foobar-api-key');

      await request(app.getHttpServer())
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: true })
        .expect(200)
        .expect({ apiKey: 'foobar-api-key' });

      sinon.assert.calledWith(generateHashStub, 'foobar-api-key');
      sinon.assert.calledWithMatch(updateStub, auth, 'foo', 'bar', true, 'hashed api key');
    });

    it('should disable the repository if enabled = false', async () => {
      updateStub.resolves();

      await request(app.getHttpServer())
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: false })
        .expect(204);

      sinon.assert.notCalled(generateApiKeyStub);
      sinon.assert.calledWithMatch(updateStub, auth, 'foo', 'bar', false);
    });

    it('should result in 400 when enabled is not present', async () => {
      await request(app.getHttpServer())
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabledIsMissing: true })
        .expect(400)
        .expect(/PATCH is only allowed for the `enabled` property/);
    });
  });
});
