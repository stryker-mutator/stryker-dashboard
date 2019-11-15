import { Controller, Get, Put, BodyParams, QueryParams, HeaderParams, Req } from '@tsed/common';
import { BadRequest, NotFound, Unauthorized, InternalServerError } from 'ts-httpexceptions';
import { MutationTestingReportMapper, MutationTestingReport } from '@stryker-mutator/dashboard-data-access';
import { Slug, InvalidSlugError } from '@stryker-mutator/dashboard-common';
import DataAccess from '../services/DataAccess';
import { ReportValidator } from '../services/SchemaValidator';
import { calculateMetrics } from 'mutation-testing-metrics';
import Configuration from '../services/Configuration';
import { ApiKeyValidator } from '../services/ApiKeyValidator';
import { Request } from 'express';
import { Report } from '@stryker-mutator/dashboard-contract';
import { isMutationTestResult, MutationScoreOnlyResult } from '@stryker-mutator/dashboard-contract';
import { MutationTestResult } from '@stryker-mutator/dashboard-data-access/node_modules/mutation-testing-report-schema';

interface PutReportResponse {
  href: string;
}

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/reports')
export default class ReportsController {

  private readonly repo: MutationTestingReportMapper;

  constructor(dataAccess: DataAccess,
              private readonly reportValidator: ReportValidator,
              private readonly config: Configuration,
              private readonly apiKeyValidator: ApiKeyValidator) {
    this.repo = dataAccess.mutationTestingReportMapper;
  }

  @Put('/*')
  public async update(
    @Req() req: Request,
    @BodyParams() result: MutationScoreOnlyResult | MutationTestResult,
    @QueryParams('module') moduleName: string | undefined,
    @HeaderParams(API_KEY_HEADER) authorizationHeader: string | undefined,
  ): Promise<PutReportResponse> {
    if (!authorizationHeader) {
      throw new Unauthorized(`Provide an "${API_KEY_HEADER}" header`);
    }
    const slug = req.path;
    const { project, version } = this.parseSlug(slug);
    await this.apiKeyValidator.validateApiKey(authorizationHeader, project);
    this.verifyRequiredPutReportProperties(result);
    try {
      await this.saveReport(project, version, moduleName, result);
      return {
        href: `${this.config.baseUrl}/reports/${project}/${version}${moduleName ? `?module=${moduleName}` : ''}`
      };
    } catch (err) {
      console.error(`Error while trying to save report ${JSON.stringify({ project, version, moduleName })}`, err);
      throw new InternalServerError('Internal server error');
    }
  }

  @Get('/*')
  public async get(
    @Req() req: Request,
    @QueryParams('module') moduleName: string | undefined
  ): Promise<Report> {
    const slug = req.path;
    const { project, version } = this.parseSlug(slug);
    const result = await this.repo.findOne({
      projectName: project,
      moduleName,
      version
    });
    if (result) {
      return ReportsController.toDto(result);
    } else {
      throw new NotFound(`Report "${project}/${version}" does not exist`);
    }
  }

  public static toDto(dataObject: MutationTestingReport): Report {
    return {
      moduleName: dataObject.moduleName,
      projectName: dataObject.projectName,
      version: dataObject.version,
      mutationScore: dataObject.mutationScore,
      ...dataObject.result
    };
  }

  private parseSlug(slug: string) {
    try {
      return Slug.parse(slug);
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        throw new NotFound(`Invalid slug "${slug}"`);
      } else {
        throw error;
      }
    }
  }

  private async saveReport(projectName: string, version: string, moduleName: string | undefined, result: MutationScoreOnlyResult | MutationTestResult) {
    const mutationScore = this.calculateMutationScore(result);
    await this.repo.insertOrMergeEntity({
      version,
      result: isMutationTestResult(result) ? result : null,
      moduleName,
      projectName,
      mutationScore
    });
  }
  private calculateMutationScore(result: MutationScoreOnlyResult | MutationTestResult) {
    if (isMutationTestResult(result)) {
      return calculateMetrics(result.files).metrics.mutationScore;
    } else {
      return result.mutationScore || 0;
    }
  }

  private verifyRequiredPutReportProperties(body: MutationScoreOnlyResult | MutationTestResult) {
    const errors = this.reportValidator.findErrors(body);
    if (errors) {
      const mutationScoreOnlyResult = body as MutationScoreOnlyResult;
      if (typeof mutationScoreOnlyResult.mutationScore !== 'number'
        || mutationScoreOnlyResult.mutationScore < 0
        || mutationScoreOnlyResult.mutationScore > 100) {
        throw new BadRequest(`Invalid report. ${errors}`);
      }
    }
  }
}
