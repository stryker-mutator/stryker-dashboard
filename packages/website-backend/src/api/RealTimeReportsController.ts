import {
  BodyParams,
  Context,
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
import MutationtEventServerOrchestrator from '../services/real-time/MutationtEventServerOrchestrator.js';
import { MutationTestResult } from 'mutation-testing-report-schema';
import { parseSlug } from './util.js';
import { ReportValidator } from '../services/SchemaValidator.js';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import Configuration from '../services/Configuration.js';

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/real-time')
export default class RealTimeReportsController {
  #apiKeyValidator: ApiKeyValidator;
  #reportService: MutationTestingReportService;
  #blobService: RealTimeMutantsBlobService;
  #orchestrator: MutationtEventServerOrchestrator;
  #reportValidator: ReportValidator;
  #config: Configuration;

  constructor(
    apiKeyValidator: ApiKeyValidator,
    dataAcces: DataAccess,
    mutationtEventServerOrchestrator: MutationtEventServerOrchestrator,
    reportValidator: ReportValidator,
    config: Configuration
  ) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#reportService = dataAcces.mutationTestingReportService;
    this.#blobService = dataAcces.blobService;
    this.#orchestrator = mutationtEventServerOrchestrator;
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
    const report = await this.#reportService.findOne({
      projectName: project,
      version,
      moduleName,
      realTime: true,
    });
    if (report === null) {
      throw new NotFound(
        `Version "${version}" does not exist for "${project}".`
      );
    }

    const data = await this.#blobService.getEvents({
      projectName: project,
      version,
      moduleName,
      realTime: true,
    });

    const server = this.#orchestrator.getSseInstanceForProject(project);
    server.attach(res);
    data.forEach((mutant) => server.sendMutantTested(mutant));
  }

  @Post('/*')
  public async UpdateBatch(
    @Req() req: Request,
    @BodyParams()
    mutants: Array<Partial<MutantResult>> | object | null | undefined,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined
  ) {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project, version } = Slug.parse(req.path);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);
    const server = this.#orchestrator.getSseInstanceForProject(project);

    if (!Array.isArray(mutants)) {
      throw new BadRequest('Please provide an array of mutant-tested events');
    }

    if (mutants === null || mutants === undefined) {
      throw new BadRequest('Please provide mutant-tested events');
    }

    await this.#blobService.appendToBlob(
      { projectName: project, version, moduleName: undefined, realTime: true },
      mutants
    );
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
      const information = {
        projectName: project,
        version: version,
        moduleName,
        realTime: true,
      };
      await this.#savePendingReport(information, result, $ctx.logger);
      await this.#createRealTimeBlob(information);
      return this.#getReportResponse(information);
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
    information: ReportIdentifier,
    result: MutationTestResult,
    logger: Logger
  ) {
    await this.#reportService.saveReport(information, result, logger);
  }

  async #createRealTimeBlob(information: ReportIdentifier) {
    this.#blobService.createBlob(information);
  }

  #getReportResponse(information: ReportIdentifier): PutReportResponse {
    const base = `${this.#config.baseUrl}/reports/${information.projectName}/${
      information.version
    }`;

    if (information.moduleName) {
      return {
        href: `${base}?module=${information.moduleName}&realTime=true`,
        projectHref: base,
      };
    }

    return {
      href: `${base}?realTime=true`,
      projectHref: base,
    };
  }
}
