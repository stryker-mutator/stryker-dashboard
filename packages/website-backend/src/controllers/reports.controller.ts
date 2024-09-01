import { MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import {
  Report,
  MutationScoreOnlyResult,
  isMutationTestResult,
  isPendingReport,
} from '@stryker-mutator/dashboard-common';
import { MutationTestResult } from 'mutation-testing-report-schema';
import { ReportValidator } from '../services/ReportValidator.js';
import Configuration from '../services/Configuration.js';
import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import DataAccess from '../services/DataAccess.js';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { parseSlug } from '../utils/utils.js';

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/reports')
export default class ReportsController {
  #apiKeyValidator: ApiKeyValidator;
  #config: Configuration;
  #logger = new Logger(ReportsController.name);
  #reportService: MutationTestingReportService;
  #reportValidator: ReportValidator;

  constructor(
    apiKeyValidator: ApiKeyValidator,
    config: Configuration,
    dataAccess: DataAccess,
    reportValidator: ReportValidator,
  ) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#config = config;
    this.#reportService = dataAccess.mutationTestingReportService;
    this.#reportValidator = reportValidator;
  }

  @Put('/:slug(*)')
  public async update(
    @Param('slug') slug: string,
    @Body() result: MutationScoreOnlyResult | MutationTestResult,
    @Query('module') moduleName: string | undefined,
    @Headers(API_KEY_HEADER) authorizationHeader: string | undefined,
  ): Promise<PutReportResponse> {
    if (!authorizationHeader) {
      throw new UnauthorizedException(`Provide an "${API_KEY_HEADER}" header`);
    }
    const { project, version } = parseSlug(slug);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);
    this.verifyRequiredPutReportProperties(result);
    this.verifyIsCompletedReport(result);
    try {
      await this.#reportService.saveReport({ projectName: project, version, moduleName }, result, this.#logger);

      if (moduleName && isMutationTestResult(result)) {
        return {
          href: `${this.#config.baseUrl}/reports/${project}/${version}?module=${moduleName}`,
          projectHref: `${this.#config.baseUrl}/reports/${project}/${version}`,
        };
      } else {
        return {
          href: `${this.#config.baseUrl}/reports/${project}/${version}${moduleName ? `?module=${moduleName}` : ''}`,
        };
      }
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

  @Get('/:slug(*)')
  public async get(
    @Param('slug') slug: string,
    @Query('module') moduleName: string | undefined,
    @Query('realTime') realTime: boolean | undefined,
  ): Promise<Report> {
    const { project, version } = parseSlug(slug);
    const id = {
      projectName: project,
      moduleName,
      version,
    };

    let report: Report | undefined | null;
    if (realTime) {
      report = await this.#reportService.findOne({ ...id, realTime: true });
    }

    if (!report || !isMutationTestResult(report!)) {
      report = await this.#reportService.findOne(id);
    }

    if (report) {
      return report;
    } else {
      throw new NotFoundException(`Version "${version}" does not exist for "${project}".`);
    }
  }

  private verifyRequiredPutReportProperties(body: MutationScoreOnlyResult | MutationTestResult) {
    const errors = this.#reportValidator.findErrors(body);
    if (errors) {
      const mutationScoreOnlyResult = body as MutationScoreOnlyResult;
      if (
        typeof mutationScoreOnlyResult.mutationScore !== 'number' ||
        mutationScoreOnlyResult.mutationScore < 0 ||
        mutationScoreOnlyResult.mutationScore > 100
      ) {
        throw new BadRequestException(`Invalid report. ${errors}`);
      }
    }
  }

  private verifyIsCompletedReport(result: MutationScoreOnlyResult | MutationTestResult) {
    if (!isMutationTestResult(result)) {
      return;
    }

    if (isPendingReport(result)) {
      throw new BadRequestException('Submitting pending reports to the completed reports endpoint is not allowed.');
    }
  }
}
