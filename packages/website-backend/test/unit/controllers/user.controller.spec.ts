import { expect } from 'chai';
import request from 'supertest';
import * as contract from '@stryker-mutator/dashboard-contract';
import sinon from 'sinon';
import { Authentication } from '../../../src/github/models.js';
import GithubAgent from '../../../src/github/GithubAgent.js';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';
import { AppModule } from '../../../src/app.module.js';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { contractFactory, githubFactory } from '../../helpers/producers.js';
import { DataAccessMock, config, createAuthorizationHeader } from '../../helpers/TestServer.js';
import Configuration from '../../../src/services/Configuration.js';
import UserController from '../../../src/controllers/user.controller.js';
import DataAccess from '../../../src/services/DataAccess.js';

describe(UserController.name, () => {
  const expectedUsername = 'foobar username';
  const expectedAccessToken = 'foobar access token';

  let app: INestApplication;
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

    const githubAgent = app.get<GithubAgent>(GithubAgent);
    const githubRepositoryService = app.get<GithubRepositoryService>(
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

    await app.init();
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
      await request(app.getHttpServer())
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
      await request(app.getHttpServer())
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
      await request(app.getHttpServer())
        .get('/api/user/organizations')
        .set('Authorization', authToken)
        .expect(200)
        .expect(expectedOrganizations);
    });
  });
});
