import { Controller, BodyParams, Status, Post, RequestLogger } from '@tsed/common';
import { ApiKeyValidator } from '../services/ApiKeyValidator';
import { MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';
import { BadRequest } from 'ts-httpexceptions';
import { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
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

  constructor(private readonly apiKeyValidator: ApiKeyValidator, private readonly reportService: MutationTestingReportService) {
  }

  @Post('/reports')
  @Status(201)
  public async addNew(@BodyParams() report: ScoreReport, log: RequestLogger) {
    this.verifyRequiredPostScoreReportProperties(report);
    await this.apiKeyValidator.validateApiKey(report.apiKey, report.repositorySlug);
    await this.reportService.saveReport({ moduleName: undefined, projectName: report.repositorySlug, version: report.branch }, report, log);
    return '';
  }

  private verifyRequiredPostScoreReportProperties(body: any) {
    ['apiKey', 'repositorySlug', 'mutationScore'].forEach(prop => {
      if (body[prop] === undefined) {
        throw new BadRequest(`Missing required property "${prop}"`);
      }
    });
  }
}
