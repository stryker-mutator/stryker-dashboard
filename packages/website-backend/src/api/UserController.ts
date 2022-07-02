import { Controller, Get, Req, UseBefore } from '@tsed/common';
import GithubAgent from '../github/GithubAgent.js';
import * as contract from '@stryker-mutator/dashboard-contract';
import * as github from '../github/models.js';
import GithubRepositoryService from '../services/GithubRepositoryService.js';
import { GithubSecurityMiddleware } from '../middleware/securityMiddleware.js';

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
@UseBefore(GithubSecurityMiddleware)
export default class UserController {
  constructor(
    private readonly repoService: GithubRepositoryService,
    private readonly agent: GithubAgent
  ) {}

  @Get('/')
  public async get(@Req() request: Express.Request): Promise<contract.Login> {
    return this.agent.getCurrentUser(request.user!).then(toContract);
  }

  @Get('/repositories')
  public getRepositories(
    @Req() request: Express.Request
  ): Promise<contract.Repository[]> {
    return this.repoService.getAllForUser(request.user!);
  }

  @Get('/organizations')
  public async getOrganizations(
    @Req() req: Express.Request
  ): Promise<contract.Login[]> {
    const githubLogins = await this.agent.getMyOrganizations(req.user!);
    return allToContract(githubLogins);
  }
}
