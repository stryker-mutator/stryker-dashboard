import { SuperTest, Test } from 'supertest';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import OrganizationsController from '../../../src/api/OrganizationsController';
import { githubFactory } from '../../helpers/producers';
import * as github from '../../../src/github/models';
import testServer, { RepositoryServiceStub } from '../../helpers/TestServer';
import { expect } from 'chai';
import sinon = require('sinon');

describe('OrganizationsController', () => {
    let request: SuperTest<Test>;
    let githubAgentMock: sinon.SinonStubbedInstance<GithubAgent>;
    let currentAuthentication: github.Authentication;

    beforeEach(async () => {
        currentAuthentication = githubFactory.authentication({ accessToken: 'foobar access token' });
        githubAgentMock = sinon.createStubInstance(GithubAgent);
        sinon.stub(githubAgentModule, 'default').returns(githubAgentMock);
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
