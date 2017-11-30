import { expect } from 'chai';
import { Project as ProjectEntity } from 'stryker-dashboard-data-access';
import ProjectsController from '../../../src/api/ProjectsController';
import testServer, { DataAccessStub } from '../../helpers/TestServer';
import { SuperTest, Test } from 'supertest';
import GithubAgent, * as GithubAgentModule from '../../../src/github/GithubAgent';
import { Mock, createMock } from '../../helpers/mock';
import { Repository } from '../../../src/github/models';
import { repository, projectEntity, authentication } from '../../helpers/producers';

describe('ProjectsController', () => {

    let request: SuperTest<Test>;
    let githubAgentMock: Mock<GithubAgent>;

    beforeEach(async () => {
        githubAgentMock = createMock(GithubAgent);
        sandbox.stub(GithubAgentModule, 'default').returns(githubAgentMock);
        request = await testServer(ProjectsController, authentication({ accessToken: 'foobar access token' }));
    });

    describe('HTTP GET /projects/user', () => {

        it('should list projects as repos from github with their enabled state', () => {
            const repos: Repository[] = [
                repository({ name: 'project1' }),
                repository({ name: 'project2' }),
                repository({ name: 'project3' }),
            ];
            const projectEntities: ProjectEntity[] = [
                projectEntity({ name: 'project1', enabled: false }),
                projectEntity({ name: 'project2', enabled: true }),
                projectEntity({ name: 'project3', enabled: false })
            ];
            githubAgentMock.retrieveRepositories.resolves(repos);
            DataAccessStub.projectMapper.select.resolves(projectEntities);

            return request.get('/projects/foo')
                .expect(200)
                .expect([
                    { enabled: false, name: 'project1', repositorySlug: 'Foo Bar Name', owner: 'foobar_login' },
                    { enabled: true, name: 'project2', repositorySlug: 'Foo Bar Name', owner: 'foobar_login' },
                    { enabled: false, name: 'project3', repositorySlug: 'Foo Bar Name', owner: 'foobar_login' }
                ]);
        });

        it('should retrieve the the correct data', async () => {
            githubAgentMock.retrieveRepositories.resolves([]);
            DataAccessStub.projectMapper.select.resolves([]);
            await request.get('/projects/foo');
            expect(githubAgentMock.retrieveRepositories).calledWith('foo');
            expect(DataAccessStub.projectMapper.select).calledWith('foo');
            expect(GithubAgentModule.default).calledWithNew;
            expect(GithubAgentModule.default).calledWith('foobar access token');
        });

        it('should give internal server error if database is unavailable', () => {
            DataAccessStub.projectMapper.select.rejects(new Error('database unavailable'));
            githubAgentMock.retrieveRepositories.resolves([]);
            return request.get('/projects/foo')
                .expect(500);
        });

        it('should give internal server error when github is unavailable', () => {
            DataAccessStub.projectMapper.select.resolves([]);
            githubAgentMock.retrieveRepositories.rejects(new Error('github unavailable'));
            return request.get('/projects/foo')
                .expect(500);
        });
    });

});