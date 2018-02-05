import { dalFactory, githubFactory } from '../../helpers/producers';
import * as dal from 'stryker-dashboard-data-access';
import * as contract from 'stryker-dashboard-website-contract';
import * as github from '../../../src/github/models';
import GithubAgent, * as githubAgentModule from '../../../src/github/GithubAgent';
import { Mock, createMock } from '../../helpers/mock';
import GithubRepositoryService from '../../../src/services/GithubRepositoryService';
import { expect } from 'chai';
import { HTTPException } from 'ts-httpexceptions';

describe('GithubRepositoryService', () => {

    let githubAgentMock: Mock<GithubAgent>;
    let repositoryMapperMock: Mock<dal.ProjectMapper>;
    let dataAccessStub: { repositoryMapper: Mock<dal.ProjectMapper> };
    let sut: GithubRepositoryService;

    beforeEach(() => {
        githubAgentMock = createMock(GithubAgent);
        sandbox.stub(githubAgentModule, 'default').returns(githubAgentMock);
        repositoryMapperMock = createMock(dal.ProjectMapper);
        dataAccessStub = {
            repositoryMapper: repositoryMapperMock
        };
        sut = new GithubRepositoryService(dataAccessStub as any);
    });

    describe('getAllForOrganizations', () => {
        it('should list projects as repos from github with their enabled state', async () => {
            const repos: github.Repository[] = [
                githubFactory.repository({ name: 'project1', full_name: 'foobarOrg/project1' }),
                githubFactory.repository({ name: 'project2', full_name: 'foobarOrg/project2' }),
                githubFactory.repository({ name: 'project3', full_name: 'foobarOrg/project3' })
            ];
            const projectEntities: dal.Project[] = [
                dalFactory.repository({ name: 'project1', enabled: false }),
                dalFactory.repository({ name: 'project2', enabled: true }),
                dalFactory.repository({ name: 'project3', enabled: false })
            ];
            const expectedRepos: contract.Repository[] = [
                { enabled: false, name: 'project1', origin: 'github', slug: 'github.com/foobarOrg/project1', owner: 'foobar_login' },
                { enabled: true, name: 'project2', origin: 'github', slug: 'github.com/foobarOrg/project2', owner: 'foobar_login' },
                { enabled: false, name: 'project3', origin: 'github', slug: 'github.com/foobarOrg/project3', owner: 'foobar_login' }
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
            expect(dataAccessStub.repositoryMapper.select).calledWith('github.com/foobarOrg');
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

    describe('update', () => {
        [github.Permission.none, github.Permission.read].forEach(permission => {
            it(`should not allow if user has permission "${permission}"`, async () => {
                const userPermission: github.UserPermission = {
                    permission,
                    user: githubFactory.login()
                };
                githubAgentMock.getUserPermissionForRepository.resolves(userPermission);
                try {
                    await sut.update(githubFactory.authentication(), '', '', true);
                    expect.fail('Should have thrown');
                } catch (err) {
                    const httpError = err as HTTPException;
                    expect(httpError.status).eq(401);
                    expect(httpError.message)
                        .eq(`Permission denied. foobar does not have enough permissions for resource / (was ${userPermission.permission}).`);
                }
            });
        });

        [github.Permission.admin, github.Permission.write].forEach(permission => {
            it(`should allow if user has permission "${permission}"`, async () => {
                const userPermission: github.UserPermission = {
                    permission,
                    user: githubFactory.login()
                };
                githubAgentMock.getUserPermissionForRepository.resolves(userPermission);
                await sut.update(githubFactory.authentication(), 'owner', 'name', true);
                expect(dataAccessStub.repositoryMapper.insertOrMergeEntity).called;
            });
        });

        it('should update the repository entity', async () => {
            const userPermission: github.UserPermission = {
                permission: github.Permission.admin,
                user: githubFactory.login()
            };
            githubAgentMock.getUserPermissionForRepository.resolves(userPermission);
            await sut.update(githubFactory.authentication(), 'owner', 'name', true, 'apiKeyHash');
            expect(dataAccessStub.repositoryMapper.insertOrMergeEntity).calledWith({
                apiKeyHash: 'apiKeyHash',
                enabled: true,
                name: 'name',
                owner: 'github.com/owner'
            });
        });
    });
});
