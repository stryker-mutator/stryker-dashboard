import supertest, { SuperTest, Test } from 'supertest';
import { contractFactory, githubFactory } from '../../helpers/producers.js';
import { expect } from 'chai';
import sinon from 'sinon';
import { PlatformTest } from '@tsed/common';
import Server from '../../../src/Server.js';
import { createAuthorizationHeader } from '../../helpers/TestServer.js';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService.js';

describe('OrganizationsController', () => {
  let request: SuperTest<Test>;

  beforeEach(async () => {
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());
  });

  describe('HTTP GET /organizations/:name/repositories', () => {
    it('should retrieve the organizations', async () => {
      // Arrange
      const expectedUser = githubFactory.authentication({
        accessToken: 'foobar access token',
      });
      const authorizeToken = await createAuthorizationHeader(expectedUser);
      const service = PlatformTest.get<GithubRepositoryService>(
        GithubRepositoryService
      );
      const getAllForOrganizationStub = sinon.stub(
        service,
        'getAllForOrganization'
      );
      const expectedRepos = [contractFactory.repository({ slug: 'some repo' })];
      getAllForOrganizationStub.resolves(expectedRepos);

      // Act
      await request
        .get('/api/organizations/foobarOrg/repositories')
        .set('Authorization', authorizeToken)
        // Assert
        .expect(200)
        .expect(expectedRepos);

      expect(getAllForOrganizationStub).calledWithMatch(
        expectedUser,
        'foobarOrg'
      );
    });
  });
});
