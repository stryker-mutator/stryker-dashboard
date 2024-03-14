import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import * as github from '../../../src/github/models.js';
import Configuration from '../../../src/services/Configuration.js';
import {
  DataAccessMock,
  config,
  createAuthorizationHeader,
} from '../../helpers/TestServer.js';
import { INestApplication } from '@nestjs/common';
import utils from '../../../src/utils/utils.js';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';
import { githubFactory } from '../../helpers/producers.js';
import DataAccess from '../../../src/services/DataAccess.js';

describe('RepositoriesController', () => {
  let app: INestApplication;
  let generateHashStub: sinon.SinonStubbedMember<
    typeof utils.generateHashValue
  >;
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
    const githubRepositoryService = app.get<GithubRepositoryService>(
      GithubRepositoryService,
    );
    updateStub = sinon.stub(githubRepositoryService, 'update');

    await app.init();
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

      expect(generateHashStub).calledWith('foobar-api-key');
      expect(updateStub).calledWithMatch(
        auth,
        'foo',
        'bar',
        true,
        'hashed api key',
      );
    });

    it('should disable the repository if enabled = false', async () => {
      updateStub.resolves();

      await request(app.getHttpServer())
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: false })
        .expect(204);

      expect(generateApiKeyStub).not.called;
      expect(updateStub).calledWithMatch(auth, 'foo', 'bar', false);
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
