import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  isMutationTestResult,
  isPendingReport,
  MutationScoreOnlyResult,
  Report,
} from '@stryker-mutator/dashboard-common';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import { MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';
import { MutationTestResult } from 'mutation-testing-report-schema';

import { JwtOrApiKeyGuard } from '../auth/guard.js';
import Configuration from '../services/Configuration.js';
import DataAccess from '../services/DataAccess.js';
import { ReportValidator } from '../services/ReportValidator.js';
import { parseSlug } from '../utils/utils.js';

@Controller('/reports')
export default class ReportsController {
  #config: Configuration;
  #logger = new Logger(ReportsController.name);
  #reportService: MutationTestingReportService;
  #reportValidator: ReportValidator;

  constructor(config: Configuration, dataAccess: DataAccess, reportValidator: ReportValidator) {
    this.#config = config;
    this.#reportService = dataAccess.mutationTestingReportService;
    this.#reportValidator = reportValidator;
  }

  @Put('/*slug')
  @UseGuards(JwtOrApiKeyGuard)
  public async update(
    @Param('slug') slug: string[],
    @Body() result: MutationScoreOnlyResult | MutationTestResult,
    @Query('module') moduleName: string | undefined,
  ): Promise<PutReportResponse> {
    const { project, version } = parseSlug(slug.join('/'));
    await this.verifyRequiredPutReportProperties(result);
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

  @Get('/*slug')
  public async get(
    @Param('slug') slug: string[],
    @Query('module') moduleName: string | undefined,
    @Query('realTime') realTime: boolean | undefined,
  ): Promise<Report> {
    const { project, version } = parseSlug(slug.join('/'));
    const id = {
      projectName: project,
      moduleName,
      version,
    };

    let report: Report | undefined | null;
    if (realTime) {
      report = await this.#reportService.findOne({ ...id, realTime: true });
    }

    if (!report || !isMutationTestResult(report)) {
      report = await this.#reportService.findOne(id);
    }

    if (report) {
      return report;
    } else {
      throw new NotFoundException(`Version "${version}" does not exist for "${project}".`);
    }
  }

  @Delete('/*slug')
  @HttpCode(204)
  @UseGuards(JwtOrApiKeyGuard)
  public async delete(@Param('slug') slug: string[], @Query('module') moduleName: string | undefined) {
    const { project, version } = parseSlug(slug.join('/'));
    const id = {
      projectName: project,
      moduleName,
      version,
    };

    try {
      await this.#reportService.delete(id, this.#logger);
    } catch (error) {
      this.#logger.error({
        message: `Error while trying to delete report ${JSON.stringify({
          project,
          version,
          moduleName,
        })}`,
        error,
      });
      throw new InternalServerErrorException('Internal server error');
    }
  }

  private async verifyRequiredPutReportProperties(body: MutationScoreOnlyResult | MutationTestResult) {
    const errors = await this.#reportValidator.findErrors(body);
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
