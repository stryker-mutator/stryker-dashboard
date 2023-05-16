import {
  BodyParams,
  Get,
  HeaderParams,
  Post,
  QueryParams,
  Req,
  Res,
  Response,
} from '@tsed/common';
import { Controller } from '@tsed/di';
import { Request } from 'express';
import MutationtEventServerOrchestrator from '../services/real-time/MutationtEventServerOrchestrator.js';
import { MutantResult } from '@stryker-mutator/api/core';
import { Slug } from '@stryker-mutator/dashboard-common';
import DataAccess from '../services/DataAccess.js';
import { MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';
import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import { BadRequest, NotFound, Unauthorized } from 'ts-httpexceptions';

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/real-time')
export default class RealtimeUpdatesController {
  #apiKeyValidator: ApiKeyValidator;
  #reportService: MutationTestingReportService;
  #orchestrator: MutationtEventServerOrchestrator;

  constructor(
    apiKeyValidator: ApiKeyValidator,
    dataAcces: DataAccess,
    mutationtEventServerOrchestrator: MutationtEventServerOrchestrator
  ) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#reportService = dataAcces.mutationTestingReportService;
    this.#orchestrator = mutationtEventServerOrchestrator;
  }

  @Get('/*')
  public async getSseEndpointForProject(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParams('module') moduleName: string | undefined
  ) {
    const { project, version } = Slug.parse(req.path);
    const report = await this.#reportService.findOne({
      projectName: project,
      version,
      moduleName,
    });
    if (report === null) {
      throw new NotFound(
        `Version "${version}" does not exist for "${project}".`
      );
    }

    const server = this.#orchestrator.getSseInstanceForProject(project);
    server.attach(res);
  }

  @Post('/*')
  public async UpdateBatch(
    @Req() req: Request,
    @BodyParams()
    result: Array<Partial<MutantResult>> | object | null | undefined,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined
  ) {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project } = Slug.parse(req.path);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);
    const server = this.#orchestrator.getSseInstanceForProject(project);

    if (!Array.isArray(result)) {
      throw new BadRequest('Please provide an array of mutant-tested events');
    }

    if (result === null || result === undefined) {
      throw new BadRequest('Please provide mutant-tested events');
    }

    result.forEach((mutant) => {
      server.sendMutantTested(mutant);
    });
  }
}
