import { SuperTest, Test } from 'supertest';
import { Mock, createMock } from '../../helpers/mock';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import OrganizationsController from '../../../src/api/OrganizationsController';
import { githubFactory } from '../../helpers/producers';
import testServer, { RepositoryServiceStub } from '../../helpers/TestServer';
import { expect } from 'chai';

describe('OrganizationsController', () => {
    let request: SuperTest<Test>;
    let githubAgentMock: Mock<GithubAgent>;
    let currentAuthentication = githubFactory.authentication({ accessToken: 'foobar access token' });

    beforeEach(async () => {
        githubAgentMock = createMock(GithubAgent);
        sandbox.stub(githubAgentModule, 'default').returns(githubAgentMock);
        request = await testServer(OrganizationsController, currentAuthentication);
    });

    describe('HTTP GET /organizations/:name/repositories', () => {
        it('should retrieve the organizations', async () => {
            RepositoryServiceStub.getAllForOrganization.resolves(['some repo']);
            await request.get('/organizations/foobarOrg/repositories')
                .expect(200)
                .expect(['some repo']);
            expect(RepositoryServiceStub.getAllForOrganization).calledWith(currentAuthentication, 'foobarOrg');
        });
    });
});
