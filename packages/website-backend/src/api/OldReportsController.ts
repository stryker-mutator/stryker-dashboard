import { Controller, BodyParams, Status, Post } from '@tsed/common';
import { ApiKeyValidator } from '../services/ApiKeyValidator';
import DataAccess from '../services/DataAccess';
import { MutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';
import { BadRequest } from 'ts-httpexceptions';
/**
 * Represents the 'old' style of report, containing the mutation score calculated at client side
 */
interface ScoreReport {
  apiKey: string;
  repositorySlug: string;
  branch: string;
  mutationScore: number;
}

@Controller('')
export class OldReportsController {

  private readonly reportMapper: MutationTestingReportMapper;
  constructor(private readonly apiKeyValidator: ApiKeyValidator, dataAccess: DataAccess) {
    this.reportMapper = dataAccess.mutationTestingReportMapper;
  }

  @Post('/reports')
  @Status(201)
  public async addNew(@BodyParams() report: ScoreReport) {
    this.verifyRequiredPostScoreReportProperties(report);
    await this.apiKeyValidator.validateApiKey(report.apiKey, report.repositorySlug);
    await this.reportMapper.insertOrMergeEntity({
      mutationScore: report.mutationScore,
      version: report.branch,
      projectName: report.repositorySlug,
      result: null
    });
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
