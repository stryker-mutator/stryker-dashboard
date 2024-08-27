import GithubAgent from '../github/GithubAgent.js';
import * as contract from '@stryker-mutator/dashboard-contract';
import * as github from '../github/models.js';
import GithubRepositoryService from '../services/GithubRepositoryService.js';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard.js';

function toContract(githubLogin: github.Login): contract.Login {
  return {
    avatarUrl: githubLogin.avatar_url,
    name: githubLogin.login,
  };
}

function allToContract(githubLogins: github.Login[]): contract.Login[] {
  return githubLogins.map(toContract);
}

@Controller('/user')
@UseGuards(JwtAuthGuard)
export default class UserController {
  #repositoryService: GithubRepositoryService;
  #agent: GithubAgent;

  constructor(repoService: GithubRepositoryService, agent: GithubAgent) {
    this.#repositoryService = repoService;
    this.#agent = agent;
  }

  @Get()
  public async get(@Req() request: Express.Request): Promise<contract.Login> {
    return this.#agent.getCurrentUser(request.user!).then(toContract);
  }

  @Get('/repositories')
  public getRepositories(@Req() request: Express.Request): Promise<contract.Repository[]> {
    return this.#repositoryService.getAllForUser(request.user!);
  }

  @Get('/organizations')
  public async getOrganizations(@Req() req: Express.Request): Promise<contract.Login[]> {
    const githubLogins = await this.#agent.getMyOrganizations(req.user!);
    return allToContract(githubLogins);
  }
}
