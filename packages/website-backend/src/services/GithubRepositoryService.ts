import DataAccess from './DataAccess.js';
import GithubAgent from '../github/GithubAgent.js';
import * as dal from '@stryker-mutator/dashboard-data-access';
import * as contract from '@stryker-mutator/dashboard-contract';
import * as github from '../github/models.js';
import {
  DashboardQuery,
  Project,
} from '@stryker-mutator/dashboard-data-access';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

/**
 * Prefix a github login name with "github.com/" in order to put it in the database
 * @param slug The github value to prefix
 */
function prefixGithub(slug: string) {
  return `github.com/${slug}`;
}

@Injectable()
export default class GithubRepositoryService {
  private readonly projectMapper: dal.ProjectMapper;

  constructor(
    dataAccess: DataAccess,
    private agent: GithubAgent,
  ) {
    this.projectMapper = dataAccess.repositoryMapper;
  }

  public async getAllForUser(
    auth: github.Authentication,
  ): Promise<contract.Repository[]> {
    const githubRepos = this.agent.getMyRepositories(auth);
    const repoEntities = this.projectMapper.findAll(
      DashboardQuery.create(Project).wherePartitionKeyEquals({
        owner: prefixGithub(auth.username),
      }),
    );
    return this.matchRepositories(githubRepos, repoEntities);
  }

  public async getAllForOrganization(
    auth: github.Authentication,
    organizationLogin: string,
  ): Promise<contract.Repository[]> {
    const githubRepos = this.agent.getOrganizationRepositories(
      auth,
      organizationLogin,
    );
    const repoEntities = this.projectMapper.findAll(
      DashboardQuery.create(Project).wherePartitionKeyEquals({
        owner: prefixGithub(organizationLogin),
      }),
    );
    return this.matchRepositories(githubRepos, repoEntities);
  }

  public async update(
    auth: github.Authentication,
    owner: string,
    name: string,
    enabled: boolean,
    apiKeyHash = '',
  ) {
    await this.guardUserHasAccess(auth, owner, name);
    await this.projectMapper.insertOrMerge({
      apiKeyHash,
      name,
      owner: prefixGithub(owner),
      enabled,
    });
  }

  private async guardUserHasAccess(
    auth: github.Authentication,
    owner: string,
    name: string,
  ): Promise<void> {
    const hasPushAccess = await this.agent.userHasPushAccess(auth, owner, name);
    if (!hasPushAccess) {
      throw new HttpException(
        `Permission denied. ${auth.username} does not have enough permissions for resource ${owner}/${name} (was "push": false).`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async matchRepositories(
    githubReposPromise: Promise<github.Repository[]>,
    repositoryEntitiesPromise: Promise<dal.Result<dal.Project>[]>,
  ): Promise<contract.Repository[]> {
    const githubRepos = await githubReposPromise;
    const repositoryEntities = await repositoryEntitiesPromise;
    return githubRepos.map((githubRepo) => {
      const projectEntity = repositoryEntities.find(
        (dalRepo) => dalRepo.model.name === githubRepo.name,
      );
      const repository: contract.Repository = {
        enabled: !!(projectEntity && projectEntity.model.enabled),
        name: githubRepo.name,
        origin: 'github',
        owner: githubRepo.owner.login,
        slug: prefixGithub(githubRepo.full_name),
        defaultBranch: githubRepo.default_branch,
      };
      return repository;
    });
  }
}
