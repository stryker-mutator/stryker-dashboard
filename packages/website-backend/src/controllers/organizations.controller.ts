import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Repository } from '@stryker-mutator/dashboard-contract';

import { JwtAuthGuard } from '../auth/guard.js';
import GithubRepositoryService from '../services/GithubRepositoryService.js';

@Controller('/organizations')
@UseGuards(JwtAuthGuard)
export default class OrganizationsController {
  #repositoryService: GithubRepositoryService;

  constructor(repositoryService: GithubRepositoryService) {
    this.#repositoryService = repositoryService;
  }

  @Get('/:name/repositories')
  public get(@Param('name') login: string, @Req() req: Express.Request): Promise<Repository[]> {
    return this.#repositoryService.getAllForOrganization(req.user!, login);
  }
}
