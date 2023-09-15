import {
  BodyParams,
  Context,
  Delete,
  Get,
  HeaderParams,
  PlatformContext,
  Post,
  Put,
  QueryParams,
  Req,
  Res,
  Response,
} from '@tsed/common';
import { Controller } from '@tsed/di';
import { Request } from 'express';
import { MutantResult } from '@stryker-mutator/api/core';
import {
  Logger,
  ReportIdentifier,
  Slug,
} from '@stryker-mutator/dashboard-common';
import DataAccess from '../services/DataAccess.js';
import {
  MutationTestingReportService,
  RealTimeMutantsBlobService,
} from '@stryker-mutator/dashboard-data-access';
import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Unauthorized,
} from 'ts-httpexceptions';
import MutationEventServerOrchestrator from '../services/real-time/MutationEventServerOrchestrator.js';
import { MutationTestResult } from 'mutation-testing-report-schema';
import { parseSlug } from './util.js';
import { ReportValidator } from '../services/ReportValidator.js';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import Configuration from '../services/Configuration.js';

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/real-time')
export default class RealTimeReportsController {
  #apiKeyValidator: ApiKeyValidator;
  #reportService: MutationTestingReportService;
  #blobService: RealTimeMutantsBlobService;
  #orchestrator: MutationEventServerOrchestrator;
  #reportValidator: ReportValidator;
  #config: Configuration;

  constructor(
    apiKeyValidator: ApiKeyValidator,
    dataAcces: DataAccess,
    mutationEventServerOrchestrator: MutationEventServerOrchestrator,
    reportValidator: ReportValidator,
    config: Configuration
  ) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#reportService = dataAcces.mutationTestingReportService;
    this.#blobService = dataAcces.blobService;
    this.#orchestrator = mutationEventServerOrchestrator;
    this.#reportValidator = reportValidator;
    this.#config = config;
  }

  @Get('/*')
  public async getSseEndpointForProject(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParams('module') moduleName: string | undefined
  ) {
    const { project, version } = Slug.parse(req.path);
    const id = {
      projectName: project,
      version,
      moduleName,
      realTime: true,
    };
    const report = await this.#reportService.findOne(id);
    if (report === null) {
      throw new NotFound(
        `Version "${version}" does not exist for "${project}".`
      );
    }

    const data = await this.#blobService.getReport(id);
    const server = this.#orchestrator.getSseInstanceForProject(id);
    server.attach(res);
    data.forEach((mutant) => server.sendMutantTested(mutant));
  }

  @Delete('/*')
  public async delete(
    @Req() req: Request,
    @QueryParams('module') moduleName: string | undefined,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined
  ) {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project, version } = Slug.parse(req.path);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const id = {
      projectName: project,
      version: version,
      moduleName,
      realTime: true,
    };
    const server = this.#orchestrator.getSseInstanceForProject(id);
    server.sendFinished();

    this.#blobService.delete(id);
    this.#reportService.delete(id);
  }

  @Post('/*')
  public async appendBatch(
    @Req() req: Request,
    @BodyParams()
    mutants: Array<Partial<MutantResult>>,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined
  ) {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project, version } = Slug.parse(req.path);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const errors = this.#reportValidator.validateMutants(mutants);
    if (errors !== undefined) {
      throw new BadRequest(`Invalid mutants: ${errors}`);
    }

    const id = {
      projectName: project,
      version,
      moduleName: undefined,
      realTime: true,
    };
    const server = this.#orchestrator.getSseInstanceForProject(id);
    await this.#blobService.appendToReport(id, mutants);
    mutants.forEach((mutant) => {
      server.sendMutantTested(mutant);
    });
  }

  @Put('/*')
  public async update(
    @Req() req: Request,
    @Context() $ctx: PlatformContext,
    @BodyParams() result: MutationTestResult,
    @QueryParams('module') moduleName: string | undefined,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined
  ): Promise<PutReportResponse> {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }
    const { project, version } = parseSlug(req.path);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const errors = this.#reportValidator.findErrors(result);
    if (errors) {
      throw new BadRequest('Invalid report. ${errors}');
    }

    try {
      const id = {
        projectName: project,
        version: version,
        moduleName,
        realTime: true,
      };
      await this.#savePendingReport(id, result, $ctx.logger);
      await this.#createRealTimeBlob(id);
      return this.#getReportResponse(id);
    } catch (error) {
      $ctx.logger.error({
        message: `Error while trying to save report ${JSON.stringify({
          project,
          version,
          moduleName,
        })}`,
        error,
      });
      throw new InternalServerError('Internal server error');
    }
  }

  async #savePendingReport(
    id: ReportIdentifier,
    result: MutationTestResult,
    logger: Logger
  ) {
    await this.#reportService.saveReport(id, result, logger);
  }

  async #createRealTimeBlob(id: ReportIdentifier) {
    this.#blobService.createReport(id);
  }

  #getReportResponse(id: ReportIdentifier): PutReportResponse {
    const base = `${this.#config.baseUrl}/reports/${id.projectName}/${
      id.version
    }`;

    if (id.moduleName) {
      return {
        href: `${base}?module=${id.moduleName}&realTime=true`,
        projectHref: base,
      };
    }

    return {
      href: `${base}?realTime=true`,
      projectHref: base,
    };
  }
}
