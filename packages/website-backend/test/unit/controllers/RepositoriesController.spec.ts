import { expect } from 'chai';
import supertest, { SuperTest, Test } from 'supertest';
import { githubFactory } from '../../helpers/producers.js';
import utils from '../../../src/utils.js';
import * as github from '../../../src/github/models.js';
import sinon from 'sinon';
import { PlatformTest } from '@tsed/common';
import Server from '../../../src/Server.js';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';
import { createAuthorizationHeader } from '../../helpers/TestServer.js';

describe('RepositoriesController', () => {
  let request: SuperTest<Test>;
  let generateHashStub: sinon.SinonStubbedMember<
    typeof utils.generateHashValue
  >;
  let generateApiKeyStub: sinon.SinonStubbedMember<typeof utils.generateApiKey>;
  let updateStub: sinon.SinonStubbedMember<GithubRepositoryService['update']>;
  let auth: github.Authentication;
  let authToken: string;

  beforeEach(async () => {
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());
    auth = githubFactory.authentication({
      accessToken: 'foobar access token',
      username: 'user',
    });
    authToken = await createAuthorizationHeader(auth);
    generateApiKeyStub = sinon.stub(utils, 'generateApiKey');
    generateHashStub = sinon.stub(utils, 'generateHashValue');
    const githubRepositoryService = PlatformTest.get<GithubRepositoryService>(
      GithubRepositoryService
    );
    updateStub = sinon.stub(githubRepositoryService, 'update');
  });

  describe('PATCH /github/:owner/:name', () => {
    it('should enable the repository with a new api key if enabled = true', async () => {
      updateStub.resolves();
      generateHashStub.returns('hashed api key');
      generateApiKeyStub.returns('foobar-api-key');
      await request
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
        'hashed api key'
      );
    });

    it('should disable the repository if enabled = false', async () => {
      updateStub.resolves();
      await request
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: false })
        .expect(204);
      expect(generateApiKeyStub).not.called;
      expect(updateStub).calledWithMatch(auth, 'foo', 'bar', false);
    });

    it('should result in 400 when enabled is not present', async () => {
      await request
        .patch('/api/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabledIsMissing: true })
        .expect(400)
        .expect(/PATCH is only allowed for the `enabled` property/);
    });
  });
});
