import { Controller, Get, Req, PathParams } from '@tsed/common';
import { Repository } from 'stryker-dashboard-website-contract';
import GithubRepositoryService from '../services/GithubRepositoryService';

@Controller('/organizations')
export default class OrganizationsController {

  constructor(private repositoryService: GithubRepositoryService) {
  }

  @Get('/:name/repositories')
  public get(@PathParams('name') login: string, @Req() req: Express.Request): Promise<Repository[]> {
    return this.repositoryService.getAllForOrganization(req.user, login);
  }
}