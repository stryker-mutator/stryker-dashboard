import { Controller, Get, Req, PathParams, UseBefore } from '@tsed/common';
import { Repository } from 'stryker-dashboard-website-contract';
import GithubRepositoryService from '../services/GithubRepositoryService';
import { GithubSecurityMiddleware } from '../middleware/securityMiddleware';

@Controller('/organizations')
@UseBefore(GithubSecurityMiddleware)
export default class OrganizationsController {

  constructor(private readonly repositoryService: GithubRepositoryService) {
  }

  @Get('/:name/repositories')
  public get(@PathParams('name') login: string, @Req() req: Express.Request): Promise<Repository[]> {
    return this.repositoryService.getAllForOrganization(req.user, login);
  }
}
