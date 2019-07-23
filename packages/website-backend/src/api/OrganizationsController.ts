import { Controller, Get, Req, PathParams, Use } from '@tsed/common';
import { Repository } from 'stryker-dashboard-website-contract';
import GithubRepositoryService from '../services/GithubRepositoryService';
import { GithubSecurityMiddleware } from '../middleware/securityMiddleware';

@Controller('/organizations')
@Use(GithubSecurityMiddleware)
export default class OrganizationsController {

  constructor(private readonly repositoryService: GithubRepositoryService) {
  }

  @Get('/:name/repositories')
  public get(@PathParams('name') login: string, @Req() req: Express.Request): Promise<Repository[]> {
    return this.repositoryService.getAllForOrganization(req.user, login);
  }
}
