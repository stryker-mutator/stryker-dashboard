import { expect } from 'chai';
import { SuperTest, Test } from 'supertest';
import * as contract from '@stryker-mutator/dashboard-contract';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import testServer, { RepositoryServiceStub, createAuthToken } from '../../helpers/TestServer';
import UserController from '../../../src/api/UserController';
import { githubFactory, contractFactory } from '../../helpers/producers';
import sinon = require('sinon');
import { Authentication } from '../../../dist/src/github/models';

describe('UserController', () => {
  let request: SuperTest<Test>;
  let githubAgentMock: sinon.SinonStubbedInstance<GithubAgent>;
  const expectedUsername = 'foobar username';
  const expectedAccessToken = 'foobar access token';
  let auth: Authentication;
  let authToken: string;
  beforeEach(async () => {
    githubAgentMock = sinon.createStubInstance(GithubAgent);
    sinon.stub(githubAgentModule, 'default').returns(githubAgentMock);
    request = await testServer(UserController);
    auth = githubFactory.authentication({
      accessToken: expectedAccessToken,
      username: expectedUsername
    });
    authToken = await createAuthToken(auth);
  });

  describe('HTTP GET /user', () => {

    it('should construct the github agent with the correct access token', async () => {
      await request.get('/user')
        .set('Authorization', authToken)
        .expect(500);
      expect(githubAgentModule.default).calledWith(expectedAccessToken);
    });

    it('should retrieve current user', async () => {
      const githubResult = githubFactory.login({
        avatar_url: 'bar',
        login: 'foo',
        url: 'bazUrl'
      });
      const expectedResult = contractFactory.login({
        avatarUrl: 'bar',
        name: 'foo'
      });
      githubAgentMock.getCurrentUser.resolves(githubResult);
      await request.get('/user')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedResult);

      expect(githubAgentMock.getCurrentUser).called;
    });

  });

  describe('HTTP GET /user/repositories', () => {
    it('should retrieve repositories', async () => {
      const expectedRepositories = [contractFactory.repository({
        name: 'foobar-repository'
      })];
      RepositoryServiceStub.getAllForUser.resolves(expectedRepositories);
      await request.get('/user/repositories')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedRepositories);
    });
  });

  describe('HTTP GET /user/organizations', () => {

    it('should retrieve the organizations from github', async () => {
      const expectedOrganizations: contract.Login[] = [{
        avatarUrl: 'avatar url',
        name: 'foobar.org'
      }];
      githubAgentMock.getMyOrganizations.resolves([githubFactory.login({
        avatar_url: 'avatar url',
        login: 'foobar.org'
      })]);
      await request.get('/user/organizations')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedOrganizations);
    });
  });
});
