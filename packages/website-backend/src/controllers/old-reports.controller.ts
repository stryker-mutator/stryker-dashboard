import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import { Logger, MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import DataAccess from '../services/DataAccess.js';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
/**
 * Represents the 'old' style of report, containing the mutation score calculated at client side
 */
interface ScoreReport extends MutationScoreOnlyResult {
  apiKey: string;
  repositorySlug: string;
  branch: string;
}

@Controller('/reports')
export class OldReportsController {
  #apiKeyValidator: ApiKeyValidator;
  #dal: DataAccess;

  constructor(apiKeyValidator: ApiKeyValidator, dal: DataAccess) {
    this.#apiKeyValidator = apiKeyValidator;
    this.#dal = dal;
  }

  @Post()
  @HttpCode(201)
  public async addNew(@Body() report: ScoreReport, log: Logger) {
    this.verifyRequiredPostScoreReportProperties(report);
    await this.#apiKeyValidator.validateApiKey(report.apiKey, report.repositorySlug);
    await this.#dal.mutationTestingReportService.saveReport(
      {
        moduleName: undefined,
        projectName: report.repositorySlug,
        version: report.branch,
      },
      report,
      log,
    );
    return '';
  }

  private verifyRequiredPostScoreReportProperties(body: any) {
    ['apiKey', 'repositorySlug', 'mutationScore'].forEach((prop) => {
      if (body[prop] === undefined) {
        throw new BadRequestException(`Missing required property "${prop}"`);
      }
    });
  }
}
