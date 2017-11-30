import { Controller, Get, PathParams, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import { Project } from 'stryker-dashboard-website-contract';
import DataAccess from '../services/DataAccess';

@Controller('/projects')
export default class ProjectsController {

    constructor(private dal: DataAccess) {
    }

    @Get('/:login')
    public async get( @PathParams('login') login: string, @Req() request: Express.Request): Promise<Project[]> {
        const repositoriesPromise = new GithubAgent(request.user.accessToken).retrieveRepositories(login)
        const projectsPromise = this.dal.projectMapper.select(login);
        const repos = await repositoriesPromise;
        const projectEntities = await projectsPromise;
        return repos.map(repo => {
            const projectEntity = projectEntities.find(p => p.name === repo.name);
            const project: Project = {
                enabled: !!(projectEntity && projectEntity.enabled),
                name: repo.name,
                repositorySlug: repo.full_name,
                owner: repo.owner.login
            };
            return project;
        });
    }

}