import { Repository } from '@stryker-mutator/dashboard-contract';
import GithubRepositoryService from '../services/GithubRepositoryService.js';
import { Controller, Get, Param, Req } from '@nestjs/common';

@Controller('/organizations')
export default class OrganizationsController {
  #repositoryService: GithubRepositoryService;

  constructor(repositoryService: GithubRepositoryService) {
    this.#repositoryService = repositoryService;
  }

  @Get('/:name/repositories')
  public get(
    @Param('name') login: string,
    @Req() req: Express.Request,
  ): Promise<Repository[]> {
    return this.#repositoryService.getAllForOrganization(req.user!, login);
  }
}
