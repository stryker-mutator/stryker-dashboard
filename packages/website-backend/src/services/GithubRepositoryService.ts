import { Service } from 'ts-express-decorators';
import DataAccess from './DataAccess';
import GithubAgent from '../github/GithubAgent';
import * as dal from 'stryker-dashboard-data-access';
import * as contract from 'stryker-dashboard-website-contract';
import * as github from '../github/models';
import { Permission } from '../github/models';
import { Unauthorized } from 'ts-httpexceptions';


/**
 * Prefix a github login name with "github/" in order to put it in the database
 * @param slug The github value to prefix
 */
function prefixGithub(slug: string) {
    return `github/${slug}`;
}

@Service()
export default class GithubRepositoryService {

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
            const repository: contract.Repository = {
                enabled: !!(projectEntity && projectEntity.enabled),
                origin: 'github',
                name: githubRepo.name,
                slug: prefixGithub(githubRepo.full_name),
                owner: githubRepo.owner.login
            };
            return repository;
        });
    }

    public async update(auth: github.Authentication, owner: string, name: string, enabled: boolean, apiKeyHash: string = '') {
        await this.guardUserHasAccess(auth, owner, name);
        await this.repositoryMapper.insertOrMergeEntity({ apiKeyHash, name, owner: prefixGithub(owner), enabled: true });
    }

    private async guardUserHasAccess(auth: github.Authentication, owner: string, name: string): Promise<void> {
        const agent = new GithubAgent(auth.accessToken);
        const userPermission = await agent.getUserPermissionForRepository(owner, name, auth.username);
        if (!this.userHasEditPermissions(userPermission.permission)) {
            throw new Unauthorized(`Permission denied. ${auth.username} does not have enough permissions for resource ${owner}/${name} (was ${userPermission.permission}).`);
        }
    }

    private userHasEditPermissions(permission: Permission): boolean {
        return permission === Permission.admin || permission === Permission.write;
    }
}