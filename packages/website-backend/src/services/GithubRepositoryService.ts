import { Service } from '@tsed/common';
import DataAccess from './DataAccess';
import GithubAgent from '../github/GithubAgent';
import * as dal from '@stryker-mutator/dashboard-data-access';
import * as contract from '@stryker-mutator/dashboard-contract';
import * as github from '../github/models';
import { Unauthorized } from 'ts-httpexceptions';
import { DashboardQuery, Project } from '@stryker-mutator/dashboard-data-access';

/**
 * Prefix a github login name with "github.com/" in order to put it in the database
 * @param slug The github value to prefix
 */
function prefixGithub(slug: string) {
  return `github.com/${slug}`;
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
    const repoEntities = this.repositoryMapper.findAll(DashboardQuery.create(Project).wherePartitionKeyEquals({ owner: prefixGithub(auth.username) }));
    return this.matchRepositories(githubRepos, repoEntities);
  }

  public async getAllForOrganization(auth: github.Authentication, organizationLogin: string): Promise<contract.Repository[]> {
    const agent = new GithubAgent(auth.accessToken);
    const githubRepos = agent.getOrganizationRepositories(organizationLogin);
    const repoEntities = this.repositoryMapper.findAll(DashboardQuery.create(Project).wherePartitionKeyEquals({ owner: prefixGithub(auth.username) }));
    return this.matchRepositories(githubRepos, repoEntities);
  }

  public async update(auth: github.Authentication, owner: string, name: string, enabled: boolean, apiKeyHash: string = '') {
    await this.guardUserHasAccess(auth, owner, name);
    await this.repositoryMapper.insertOrMerge({ apiKeyHash, name, owner: prefixGithub(owner), enabled });
  }

  private async guardUserHasAccess(auth: github.Authentication, owner: string, name: string): Promise<void> {
    const agent = new GithubAgent(auth.accessToken);
    const hasPushAccess = await agent.userHasPushAccess(owner, name, auth.username);
    if (!hasPushAccess) {
      throw new Unauthorized(`Permission denied. ${auth.username} does not have enough permissions for resource ${
        owner}/${name} (was "push": false).`);
    }
  }

  private async matchRepositories(
    githubReposPromise: Promise<github.Repository[]>,
    repositoryEntitiesPromise: Promise<dal.Result<dal.Project>[]>): Promise<contract.Repository[]> {
    const githubRepos = await githubReposPromise;
    const repositoryEntities = await repositoryEntitiesPromise;
    return githubRepos.map(githubRepo => {
      const projectEntity = repositoryEntities.find(dalRepo => dalRepo.model.name === githubRepo.name);
      const repository: contract.Repository = {
        enabled: !!(projectEntity && projectEntity.model.enabled),
        name: githubRepo.name,
        origin: 'github',
        owner: githubRepo.owner.login,
        slug: prefixGithub(githubRepo.full_name)
      };
      return repository;
    });
  }
}
