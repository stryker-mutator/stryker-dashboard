import { SuperTest, Test } from 'supertest';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import OrganizationsController from '../../../src/api/OrganizationsController';
import { githubFactory } from '../../helpers/producers';
import testServer, { RepositoryServiceStub, createAuthToken } from '../../helpers/TestServer';
import { expect } from 'chai';
import sinon = require('sinon');

describe('OrganizationsController', () => {
  let request: SuperTest<Test>;
  let githubAgentMock: sinon.SinonStubbedInstance<GithubAgent>;

  beforeEach(async () => {
    githubAgentMock = sinon.createStubInstance(GithubAgent);
    sinon.stub(githubAgentModule, 'default').returns(githubAgentMock);
    request = await testServer(OrganizationsController);
  });

  describe('HTTP GET /organizations/:name/repositories', () => {
    it('should retrieve the organizations', async () => {
      const expectedUser = githubFactory.authentication({ accessToken: 'foobar access token' });
      const authorizeToken = await createAuthToken(expectedUser);
      RepositoryServiceStub.getAllForOrganization.resolves(['some repo']);
      await request.get('/organizations/foobarOrg/repositories')
        .set('Authorization', authorizeToken)
        .expect(200)
        .expect(['some repo']);
      expect(RepositoryServiceStub.getAllForOrganization).calledWithMatch(expectedUser, 'foobarOrg');
    });
  });
});
