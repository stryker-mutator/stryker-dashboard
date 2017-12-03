import { dalFactory, githubFactory } from '../../helpers/producers';
import * as dal from 'stryker-dashboard-data-access';
import * as contract from 'stryker-dashboard-website-contract';
import * as github from '../../../src/github/models';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import { Mock, createMock } from '../../helpers/mock';
import RepositoryService from '../../../src/services/RepositoryService';
import { expect } from 'chai';

describe('RepositoryService', () => {

    let githubAgentMock: Mock<GithubAgent>;
    let repositoryMapperMock: Mock<dal.ProjectMapper>;
    let dataAccessStub: { repositoryMapper: Mock<dal.ProjectMapper> };
    let sut: RepositoryService;

    beforeEach(() => {
        githubAgentMock = createMock(GithubAgent);
        sandbox.stub(githubAgentModule, 'default').returns(githubAgentMock);
        repositoryMapperMock = createMock(dal.ProjectMapper);
        dataAccessStub = {
            repositoryMapper: repositoryMapperMock
        };
        sut = new RepositoryService(dataAccessStub as any);
    });

    describe('getAllForOrganizations', () => {
        it('should list projects as repos from github with their enabled state', async () => {
            const repos: github.Repository[] = [
                githubFactory.repository({ name: 'project1', full_name: 'foobarOrg/project1' }),
                githubFactory.repository({ name: 'project2', full_name: 'foobarOrg/project2' }),
                githubFactory.repository({ name: 'project3', full_name: 'foobarOrg/project3' }),
            ];
            const projectEntities: dal.Project[] = [
                dalFactory.repository({ name: 'project1', enabled: false }),
                dalFactory.repository({ name: 'project2', enabled: true }),
                dalFactory.repository({ name: 'project3', enabled: false })
            ];
            const expectedRepos: contract.Repository[] = [
                { enabled: false, name: 'project1', slug: 'github/foobarOrg/project1', owner: 'github/foobar_login' },
                { enabled: true, name: 'project2', slug: 'github/foobarOrg/project2', owner: 'github/foobar_login' },
                { enabled: false, name: 'project3', slug: 'github/foobarOrg/project3', owner: 'github/foobar_login' }
            ];
            githubAgentMock.getOrganizationRepositories.resolves(repos);
            dataAccessStub.repositoryMapper.select.resolves(projectEntities);

            const actual = await sut.getAllForOrganization(githubFactory.authentication(), 'foobarOrg');
            expect(actual).deep.eq(expectedRepos);
        });

        it('should retrieve the correct data', async () => {
            githubAgentMock.getOrganizationRepositories.resolves([]);
            dataAccessStub.repositoryMapper.select.resolves([]);
            await sut.getAllForOrganization(githubFactory.authentication({ accessToken: '213ASDcs' }), 'foobarOrg');
            expect(githubAgentMock.getOrganizationRepositories).calledWith('foobarOrg');
            expect(dataAccessStub.repositoryMapper.select).calledWith('github/foobarOrg');
            expect(githubAgentModule.default).calledWithNew;
            expect(githubAgentModule.default).calledWith('213ASDcs');
        });

        it('should reject if database is unavailable', () => {
            dataAccessStub.repositoryMapper.select.rejects(new Error('database unavailable'));
            githubAgentMock.getOrganizationRepositories.resolves([]);
            return expect(sut.getAllForOrganization(githubFactory.authentication(), '')).rejectedWith('database unavailable');
        });

        it('should give internal server error when github is unavailable', () => {
            dataAccessStub.repositoryMapper.select.resolves([]);
            githubAgentMock.getOrganizationRepositories.rejects(new Error('github unavailable'));
            return expect(sut.getAllForOrganization(githubFactory.authentication(), '')).rejectedWith('github unavailable');
        });
    });

});
