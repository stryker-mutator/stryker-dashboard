import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import { contractFactory, githubFactory } from '../../helpers/producers.js';
import { DataAccessMock, config, createAuthorizationHeader } from '../../helpers/TestServer.js';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';
import { AppModule } from '../../../src/app.module.js';
import Configuration from '../../../src/services/Configuration.js';
import OrganizationsController from '../../../src/controllers/organizations.controller.js';
import DataAccess from '../../../src/services/DataAccess.js';

describe(OrganizationsController.name, () => {
  let app: INestApplication;
  const repositoryStub = sinon.createStubInstance(GithubRepositoryService);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GithubRepositoryService)
      .useValue(repositoryStub)
      .overrideProvider(Configuration)
      .useValue(config)
      .overrideProvider(DataAccess)
      .useValue(new DataAccessMock())
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
  });

  describe('HTTP GET /organizations/:name/repositories', () => {
    it('should retrieve the organizations', async () => {
      // Arrange
      const expectedUser = githubFactory.authentication({
        accessToken: 'foobar access token',
      });
      const authorizeToken = await createAuthorizationHeader(expectedUser);
      const expectedRepos = [contractFactory.repository({ slug: 'some repo' })];
      const getAllForOrganizationStub = sinon
        .stub(repositoryStub, 'getAllForOrganization')
        .resolves(expectedRepos);

      // Act
      await request(app.getHttpServer())
        .get('/api/organizations/foobarOrg/repositories')
        .set('Authorization', authorizeToken)
        .expect(200)
        .expect(expectedRepos);

      // Assert
      expect(getAllForOrganizationStub).calledWithMatch(
        expectedUser,
        'foobarOrg'
      );
    });
  });
});
