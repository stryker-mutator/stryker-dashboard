import { Service } from 'ts-express-decorators';
import DataAccess from './DataAccess';
import GithubAgent from '../github/GithubAgent';
import * as dal from 'stryker-dashboard-data-access';
import * as contract from 'stryker-dashboard-website-contract';
import * as github from '../github/models';


/**
 * Prefix a github login name with "github/" in order to put it in the database
 * @param slug The github value to prefix
 */
function prefixGithub(slug: string) {
    return `github/${slug}`;
}

@Service()
export default class RepositoryService {
    private readonly repositoryMapper: dal.ProjectMapper;

    constructor(dataAccess: DataAccess) {
        this.repositoryMapper = dataAccess.repositoryMapper;
    }

    public async getAllForUser(auth: github.Authentication): Promise<contract.Repository[]> {
        const agent = new GithubAgent(auth.accessToken);
        const githubRepos = agent.getMyRepositories();
        const repoEntities = this.repositoryMapper.select(prefixGithub(auth.username));
        return this.matchRepositories(githubRepos, repoEntities);
    }

    public async getAllForOrganization(auth: github.Authentication, organizationLogin: string): Promise<contract.Repository[]> {
        const agent = new GithubAgent(auth.accessToken);
        const githubRepos = agent.getOrganizationRepositories(organizationLogin);
        const repoEntities = this.repositoryMapper.select(prefixGithub(organizationLogin));
        return this.matchRepositories(githubRepos, repoEntities);
    }

    private async matchRepositories(githubReposPromise: Promise<github.Repository[]>, repositoryEntitiesPromise: Promise<dal.Project[]>): Promise<contract.Repository[]> {
        const githubRepos = await githubReposPromise;
        const repositoryEntities = await repositoryEntitiesPromise;
        return githubRepos.map(githubRepo => {
            const projectEntity = repositoryEntities.find(dalRepo => dalRepo.name === githubRepo.name);
            const project: contract.Repository = {
                enabled: !!(projectEntity && projectEntity.enabled),
                name: githubRepo.name,
                slug: prefixGithub(githubRepo.full_name),
                owner: prefixGithub(githubRepo.owner.login)
            };
            return project;
        });
    }
}