import { Controller, Req, PathParams, Patch, BodyParams, Res, UseBefore } from '@tsed/common';
import { Repository, EnableRepositoryResponse } from '@stryker-mutator/dashboard-contract';
import express from 'express';
import * as github from '../github/models';
import { BadRequest } from 'ts-httpexceptions';
import GithubRepositoryService from '../services/GithubRepositoryService';
import { generateApiKey, generateHashValue } from '../utils';
import { GithubSecurityMiddleware } from '../middleware/securityMiddleware';

@Controller('/repositories')
@UseBefore(GithubSecurityMiddleware)
export default class RepositoriesController {

  constructor(private readonly repoService: GithubRepositoryService) { }

  @Patch('/github.com/:owner/:name')
  public async update(
    @PathParams('owner') owner: string,
    @PathParams('name') name: string,
    @BodyParams() repository: Partial<Repository>,
    @Req() request: express.Request,
    @Res() response: express.Response): Promise<EnableRepositoryResponse | null> {

    if (repository.enabled === undefined) {
      throw new BadRequest('PATCH is only allowed for the `enabled` property');
    } else {
      const authentication: github.Authentication = request.user;
      if (repository.enabled) {
        const apiKey = generateApiKey();
        const apiKeyHash = generateHashValue(apiKey);
        await this.repoService.update(authentication, owner, name, true, apiKeyHash);
        const res: EnableRepositoryResponse = {
          apiKey
        };
        return res;
      } else {
        await this.repoService.update(authentication, owner, name, false);
        response.status(204);
        response.end();
        return null;
      }
    }
  }
}
