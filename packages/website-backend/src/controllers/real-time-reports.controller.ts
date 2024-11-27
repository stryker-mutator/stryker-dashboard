import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { MutantResult } from '@stryker-mutator/api/core';
import { ReportIdentifier, Slug } from '@stryker-mutator/dashboard-common';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import { MutationTestingReportService, RealTimeMutantsBlobService } from '@stryker-mutator/dashboard-data-access';
import type { Response } from 'express';
import { MutationTestResult } from 'mutation-testing-report-schema';

import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import Configuration from '../services/Configuration.js';
import DataAccess from '../services/DataAccess.js';
import MutationEventResponseOrchestrator from '../services/real-time/MutationEventResponseOrchestrator.js';
import { ReportValidator } from '../services/ReportValidator.js';
import { parseSlug } from '../utils/utils.js';

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/real-time')
export default class RealTimeReportsController {
  #apiKeyValidator: ApiKeyValidator;
  #reportService: MutationTestingReportService;
  #blobService: RealTimeMutantsBlobService;
  #orchestrator: MutationEventResponseOrchestrator;
  #reportValidator: ReportValidator;
  #config: Configuration;
  #logger: Logger = new Logger(RealTimeReportsController.name);

  constructor(
    apiKeyValidator: ApiKeyValidator,
    dataAcces: DataAccess,
    mutationEventServerOrchestrator: MutationEventResponseOrchestrator,
    reportValidator: ReportValidator,
    config: Configuration,
  ) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#reportService = dataAcces.mutationTestingReportService;
    this.#blobService = dataAcces.blobService;
    this.#orchestrator = mutationEventServerOrchestrator;
    this.#reportValidator = reportValidator;
    this.#config = config;
  }

  @Get('/:slug(*)')
  public async getSseEndpointForProject(
    @Param('slug') slug: string,
    @Res() res: Response,
    @Query('module') moduleName: string | undefined,
  ) {
    const { project, version } = Slug.parse(slug);
    const id = {
      projectName: project,
      version,
      moduleName,
      realTime: true,
    };
    const report = await this.#reportService.findOne(id);
    if (report === null) {
      throw new NotFoundException(`Version "${version}" does not exist for "${project}".`);
    }

    const data = await this.#blobService.getReport(id);
    const responseHandler = this.#orchestrator.createOrGetResponseHandler(id);
    responseHandler.add(res);
    data.forEach((mutant) => responseHandler.sendMutantTested(mutant));
  }

  @Delete('/:slug(*)')
  public async delete(
    @Param('slug') slug: string,
    @Query('module') moduleName: string | undefined,
    @Headers(API_KEY_HEADER) authorizationHeader: string | undefined,
  ) {
    if (!authorizationHeader) {
      throw new UnauthorizedException(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project, version } = Slug.parse(slug);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const id = {
      projectName: project,
      version: version,
      moduleName,
      realTime: true,
    };
    const server = this.#orchestrator.createOrGetResponseHandler(id);
    server.sendFinished();

    this.#orchestrator.removeResponseHandler(id);
    await Promise.all([this.#blobService.delete(id), this.#reportService.delete(id)]);
  }

  @Post('/:slug(*)')
  public async appendBatch(
    @Param('slug') slug: string,
    @Body()
    mutants: Partial<MutantResult>[],
    @Query('module') moduleName: string | undefined,
    @Headers(API_KEY_HEADER) authorizationHeader: string | undefined,
  ) {
    if (!authorizationHeader) {
      throw new UnauthorizedException(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project, version } = Slug.parse(slug);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const errors = this.#reportValidator.validateMutants(mutants);
    if (errors !== undefined) {
      throw new BadRequestException(`Invalid mutants: ${errors}`);
    }

    const id = {
      projectName: project,
      version,
      moduleName,
      realTime: true,
    };
    const server = this.#orchestrator.createOrGetResponseHandler(id);
    await this.#blobService.appendToReport(id, mutants);
    mutants.forEach((mutant) => {
      server.sendMutantTested(mutant);
    });
  }

  @Put('/:slug(*)')
  public async update(
    @Param('slug') slug: string,
    @Body() result: MutationTestResult,
    @Query('module') moduleName: string | undefined,
    @Headers(API_KEY_HEADER) authorizationHeader: string | undefined,
  ): Promise<PutReportResponse> {
    if (!authorizationHeader) {
      throw new UnauthorizedException(`Provide an "${API_KEY_HEADER}" header`);
    }
    const { project, version } = parseSlug(slug);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    const errors = this.#reportValidator.findErrors(result);
    if (errors) {
      throw new BadRequestException('Invalid report. ${errors}');
    }

    try {
      const id = {
        projectName: project,
        version: version,
        moduleName,
        realTime: true,
      };
      await this.#savePendingReport(id, result);
      await this.#createRealTimeBlob(id);
      return this.#getReportResponse(id);
    } catch (error) {
      this.#logger.error({
        message: `Error while trying to save report ${JSON.stringify({
          project,
          version,
          moduleName,
        })}`,
        error,
      });
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async #savePendingReport(id: ReportIdentifier, result: MutationTestResult) {
    await this.#reportService.saveReport(id, result, this.#logger);
  }

  async #createRealTimeBlob(id: ReportIdentifier) {
    await this.#blobService.createReport(id);
  }

  #getReportResponse(id: ReportIdentifier): PutReportResponse {
    const base = `${this.#config.baseUrl}/reports/${id.projectName}/${id.version}`;

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
