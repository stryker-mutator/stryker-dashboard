import { expect } from 'chai';
import supertest, { SuperTest, Test } from 'supertest';
import * as contract from '@stryker-mutator/dashboard-contract';
import GithubAgent from '../../../../src/github/GithubAgent.js';

import { githubFactory, contractFactory } from '../../../helpers/producers.js';
import sinon from 'sinon';
import { Authentication } from '../../../../dist/src/github/models.js';
import { PlatformTest } from '@tsed/common';
import Server from '../../../../src/Server.js';
import { createAuthorizationHeader } from '../../../helpers/TestServer.js';
import GithubRepositoryService from '../../../../src/services/GithubRepositoryService.js';

describe('UserController', () => {
  let request: SuperTest<Test>;
  const expectedUsername = 'foobar username';
  const expectedAccessToken = 'foobar access token';
  let auth: Authentication;
  let authToken: string;

  let getCurrentUserStub: sinon.SinonStubbedMember<
    GithubAgent['getCurrentUser']
  >;
  let getAllForUserStub: sinon.SinonStubbedMember<
    GithubRepositoryService['getAllForUser']
  >;
  let getMyOrganizationsStub: sinon.SinonStubbedMember<
    GithubAgent['getMyOrganizations']
  >;

  beforeEach(async () => {
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());
    const githubAgent = PlatformTest.get<GithubAgent>(GithubAgent);
    const githubRepositoryService = PlatformTest.get<GithubRepositoryService>(
      GithubRepositoryService
    );

    getCurrentUserStub = sinon.stub(githubAgent, 'getCurrentUser');
    getAllForUserStub = sinon.stub(githubRepositoryService, 'getAllForUser');
    getMyOrganizationsStub = sinon.stub(githubAgent, 'getMyOrganizations');

    auth = githubFactory.authentication({
      accessToken: expectedAccessToken,
      username: expectedUsername,
    });
    authToken = await createAuthorizationHeader(auth);
  });

  describe('HTTP GET /user', () => {
    it('should retrieve current user', async () => {
      const githubResult = githubFactory.login({
        avatar_url: 'bar',
        login: 'foo',
        url: 'bazUrl',
      });
      const expectedResult = contractFactory.login({
        avatarUrl: 'bar',
        name: 'foo',
      });
      getCurrentUserStub.resolves(githubResult);
      await request
        .get('/api/user')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedResult);

      expect(getCurrentUserStub).called;
    });
  });

  describe('HTTP GET /user/repositories', () => {
    it('should retrieve repositories', async () => {
      const expectedRepositories = [
        contractFactory.repository({
          name: 'foobar-repository',
        }),
      ];
      getAllForUserStub.resolves(expectedRepositories);
      await request
        .get('/api/user/repositories')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedRepositories);
    });
  });

  describe('HTTP GET /user/organizations', () => {
    it('should retrieve the organizations from github', async () => {
      const expectedOrganizations: contract.Login[] = [
        {
          avatarUrl: 'avatar url',
          name: 'foobar.org',
        },
      ];
      getMyOrganizationsStub.resolves([
        githubFactory.login({
          avatar_url: 'avatar url',
          login: 'foobar.org',
        }),
      ]);
      await request
        .get('/api/user/organizations')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedOrganizations);
    });
  });
});
