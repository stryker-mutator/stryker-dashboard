import { Repository } from '@stryker-mutator/dashboard-contract';
import type express from 'express';
import * as github from '../github/models.js';
import GithubRepositoryService from '../services/GithubRepositoryService.js';
import util from '../utils/utils.js';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard.js';

@Controller('/repositories')
@UseGuards(JwtAuthGuard)
export default class RepositoriesController {
  #repositoryService: GithubRepositoryService;

  constructor(repoService: GithubRepositoryService) {
    this.#repositoryService = repoService;
  }

  @Patch('/github.com/:owner/:name')
  public async update(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Body() repository: Partial<Repository>,
    @Req() request: express.Request,
    @Res() response: express.Response,
  ) {
    if (repository.enabled === undefined) {
      throw new BadRequestException('PATCH is only allowed for the `enabled` property');
    } else {
      const authentication: github.Authentication = request.user!;
      if (repository.enabled) {
        const apiKey = util.generateApiKey();
        const apiKeyHash = util.generateHashValue(apiKey);
        await this.#repositoryService.update(authentication, owner, name, true, apiKeyHash);
        return response.status(200).send({
          apiKey,
        });
      } else {
        await this.#repositoryService.update(authentication, owner, name, false);
        response.status(204);
        response.end();
        return null;
      }
    }
  }
}
