import { Controller, BodyParams, Post } from '@tsed/common';
import { Status } from '@tsed/schema';
import { Logger } from '@tsed/logger';
import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import { BadRequest } from 'ts-httpexceptions';
import { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import DataAccess from '../services/DataAccess.js';
/**
 * Represents the 'old' style of report, containing the mutation score calculated at client side
 */
interface ScoreReport extends MutationScoreOnlyResult {
  apiKey: string;
  repositorySlug: string;
  branch: string;
}

@Controller('')
export class OldReportsController {
  constructor(
    private readonly apiKeyValidator: ApiKeyValidator,
    private readonly dal: DataAccess
  ) {}

  @Post('/reports')
  @Status(201)
  public async addNew(@BodyParams() report: ScoreReport, log: Logger) {
    this.verifyRequiredPostScoreReportProperties(report);
    await this.apiKeyValidator.validateApiKey(
      report.apiKey,
      report.repositorySlug
    );
    await this.dal.mutationTestingReportService.saveReport(
      {
        moduleName: undefined,
        projectName: report.repositorySlug,
        version: report.branch,
      },
      report,
      log
    );
    return '';
  }

  private verifyRequiredPostScoreReportProperties(body: any) {
    ['apiKey', 'repositorySlug', 'mutationScore'].forEach((prop) => {
      if (body[prop] === undefined) {
        throw new BadRequest(`Missing required property "${prop}"`);
      }
    });
  }
}
