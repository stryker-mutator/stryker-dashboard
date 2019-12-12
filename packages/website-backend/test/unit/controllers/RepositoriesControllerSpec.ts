import { expect } from 'chai';
import RepositoriesController from '../../../src/api/RepositoriesController';
import testServer, { RepositoryServiceStub, createAuthToken } from '../../helpers/TestServer';
import { SuperTest, Test } from 'supertest';
import { githubFactory } from '../../helpers/producers';
import * as utils from '../../../src/utils';
import * as github from '../../../src/github/models';
import sinon = require('sinon');

describe('RepositoriesController', () => {

  let request: SuperTest<Test>;
  let generateHashStub: sinon.SinonStub<[string], string>;
  let generateApiKeyStub: sinon.SinonStub<[], string>;
  let auth: github.Authentication;
  let authToken: string;

  beforeEach(async () => {
    auth = githubFactory.authentication({ accessToken: 'foobar access token', username: 'user' });
    authToken = await createAuthToken(auth);
    generateApiKeyStub = sinon.stub(utils, 'generateApiKey');
    generateHashStub = sinon.stub(utils, 'generateHashValue');
    request = await testServer(RepositoriesController);
  });

  describe('PATCH /github/:owner/:name', () => {

    it('should enable the repository with a new api key if enabled = true', async () => {
      RepositoryServiceStub.update.resolves();
      generateHashStub.returns('hashed api key');
      generateApiKeyStub.returns('foobar-api-key');
      await request.patch('/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: true })
        .expect(200)
        .expect({ apiKey: 'foobar-api-key' });
      expect(generateHashStub).calledWith('foobar-api-key');
      expect(RepositoryServiceStub.update).calledWithMatch(auth, 'foo', 'bar', true, 'hashed api key');
    });

    it('should disable the repository if enabled = false', async () => {
      RepositoryServiceStub.update.resolves();
      await request.patch('/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabled: false })
        .expect(204);
      expect(generateApiKeyStub).not.called;
      expect(RepositoryServiceStub.update).calledWithMatch(auth, 'foo', 'bar', false);
    });

    it('should result in 400 when enabled is not present', async () => {
      await request.patch('/repositories/github.com/foo/bar')
        .set('Authorization', authToken)
        .send({ enabledIsMissing: true })
        .expect(400)
        .expect('PATCH is only allowed for the `enabled` property');
    });
  });
});
