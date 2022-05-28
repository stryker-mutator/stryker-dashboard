import { Controller, Get, Req, PathParams, UseBefore } from '@tsed/common';
import { Repository } from '@stryker-mutator/dashboard-contract';
import GithubRepositoryService from '../services/GithubRepositoryService.js';
import { GithubSecurityMiddleware } from '../middleware/securityMiddleware.js';

@Controller('/organizations')
@UseBefore(GithubSecurityMiddleware)
export default class OrganizationsController {
  constructor(private readonly repositoryService: GithubRepositoryService) {}

  @Get('/:name/repositories')
  public get(
    @PathParams('name') login: string,
    @Req() req: Express.Request
  ): Promise<Repository[]> {
    return this.repositoryService.getAllForOrganization(req.user!, login);
  }
}
