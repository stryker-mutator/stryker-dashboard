import { Controller, Get, Put, BodyParams, QueryParams, HeaderParams, Req } from '@tsed/common';
import { BadRequest, NotFound, Unauthorized, InternalServerError } from 'ts-httpexceptions';
import { MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';
import { Slug, InvalidSlugError, Report, MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import { ReportValidator } from '../services/SchemaValidator';
import Configuration from '../services/Configuration';
import { ApiKeyValidator } from '../services/ApiKeyValidator';
import { Request } from 'express';
import { MutationTestResult } from 'mutation-testing-report-schema';
import DataAccess from '../services/DataAccess';

interface PutReportResponse {
  href: string;
}

const API_KEY_HEADER = 'X-Api-Key';

@Controller('/reports')
export default class ReportsController {

  private readonly reportService: MutationTestingReportService;
  constructor(dataAccess: DataAccess,
              private readonly reportValidator: ReportValidator,
              private readonly config: Configuration,
              private readonly apiKeyValidator: ApiKeyValidator) {
    this.reportService = dataAccess.mutationTestingReportService;
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
      await this.reportService.saveReport({ projectName: project, version, moduleName }, result, req.log);
      return {
        href: `${this.config.baseUrl}/reports/${project}/${version}${moduleName ? `?module=${moduleName}` : ''}`
      };
    } catch (error) {
      req.log.error({ message: `Error while trying to save report ${JSON.stringify({ project, version, moduleName })}`, error });
      throw new InternalServerError('Internal server error');
    }
  }

  @Get('/*')
  public async get(
    @Req() req: Request,
    @QueryParams('module') moduleName: string | undefined
  ): Promise<Report> {
    if (req.log) {
      req.log.info({ test: 'Test this one' });
    }
    const slug = req.path;
    const { project, version } = this.parseSlug(slug);
    const report = await this.reportService.findOne({
      projectName: project,
      moduleName,
      version
    });
    if (report) {
      return report;
    } else {
      throw new NotFound(`Version "${version}" does not exist for "${project}".`);
    }
  }

  private parseSlug(slug: string) {
    try {
      return Slug.parse(slug);
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        throw new NotFound(`Report "${slug}" does not exist`);
      } else {
        throw error;
      }
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
