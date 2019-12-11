import { MutationTestResult, Thresholds } from 'mutation-testing-report-schema';
import { normalizeFileNames } from 'mutation-testing-metrics';
import { calculateMetrics } from 'mutation-testing-metrics';
import { MutationTestingResultMapper } from '../mappers/MutationTestingResultMapper';
import { MutationTestingReportMapper, createMutationTestingReportMapper, Result, DashboardQuery } from '../mappers';
import { MutationScoreOnlyResult, isMutationTestResult, ReportIdentifier, Report, Logger } from '@stryker-mutator/dashboard-common';
import { MutationTestingReport } from '../models';
import { OptimisticConcurrencyError } from '../errors';

const SCHEMA_VERSION = '1';

function moduleHasResult(tuple: readonly [Result<MutationTestingReport>, MutationTestResult | null]): tuple is [Result<MutationTestingReport>, MutationTestResult] {
  return !!tuple[1];
}

export class MutationTestingReportService {

  constructor(
    private readonly resultMapper: MutationTestingResultMapper = new MutationTestingResultMapper(),
    private readonly mutationScoreMapper: MutationTestingReportMapper = createMutationTestingReportMapper()) {
  }

  public async createStorageIfNotExists() {
    await this.resultMapper.createStorageIfNotExists();
    await this.mutationScoreMapper.createStorageIfNotExists();
  }

  public async saveReport(id: ReportIdentifier, result: MutationScoreOnlyResult | MutationTestResult, logger: Logger) {
    const mutationScore = this.calculateMutationScore(result);

    await this.insertOrMergeReport(id, {
      ...id,
      mutationScore
    }, isMutationTestResult(result) ? this.normalizeResult(result) : null);
    if (isMutationTestResult(result) && id.moduleName) {
      await this.aggregateProjectReport(id.projectName, id.version, logger);
    }
  }

  private async aggregateProjectReport(projectName: string, version: string, logger: Logger) {
    const id: ReportIdentifier = {
      projectName,
      version,
      moduleName: undefined
    };

    while (!await this.tryAggregateProjectReport(id)) {
      logger.info({ message: `Optimistic concurrency exception occurred while trying to aggregate the report ${JSON.stringify(id)}, retrying...` });
    }
  }

  private async tryAggregateProjectReport(id: ReportIdentifier) {
    const projectMutationScoreModel = await this.mutationScoreMapper.findOne(id);
    const moduleScoreResults = await this.mutationScoreMapper.findAll(DashboardQuery.create(MutationTestingReport)
      .wherePartitionKeyEquals(id)
      .whereRowKeyNotEquals({ moduleName: undefined })
    );
    const scoreResultWithResult = (await Promise.all(moduleScoreResults
      .map(async score => [score, await this.resultMapper.findOne(score.model)] as const))).filter(moduleHasResult);
    if (scoreResultWithResult.length) {
      const projectResult = this.mergeResults(scoreResultWithResult);
      const projectReport: MutationTestingReport = {
        ...id,
        mutationScore: this.calculateMutationScore(projectResult)
      };
      try {
        await this.resultMapper.insertOrReplace(id, projectResult);
        if (projectMutationScoreModel) {
          await this.mutationScoreMapper.replace(projectReport, projectMutationScoreModel.etag);
        }
        else {
          await this.mutationScoreMapper.insert(projectReport);
        }
      }
      catch (err) {
        if (err instanceof OptimisticConcurrencyError) {
          return false;
        }
        else {
          throw err;
        }
      }
    }
    return true;
  }

  private mergeResults(scoreResultWithResult: [Result<MutationTestingReport>, MutationTestResult][]) {
    const projectResult = this.createEmptyResult(scoreResultWithResult[0][1].thresholds);
    scoreResultWithResult.forEach(([{ model: { moduleName } }, { files }]) => {
      Object.entries(files).forEach(([fileName, fileResult]) => {
        projectResult.files[`${moduleName}/${fileName}`] = fileResult;
      });
    });
    return projectResult;
  }

  public async findOne(id: ReportIdentifier): Promise<Report | null> {
    const [reportEntity, result] = await Promise.all([this.mutationScoreMapper.findOne(id), this.resultMapper.findOne(id)]);
    if (reportEntity) {
      if (result) {
        return {
          ...id,
          mutationScore: reportEntity.model.mutationScore,
          ...result
        };
      } else {
        return { ...id, mutationScore: reportEntity.model.mutationScore };
      }
    } else {
      return null;
    }
  }

  private async insertOrMergeReport(id: ReportIdentifier, report: MutationTestingReport, result: MutationTestResult | null) {
    await Promise.all([
      this.resultMapper.insertOrReplace(id, result),
      this.mutationScoreMapper.insertOrMerge(report)
    ]);
  }

  private calculateMutationScore(result: MutationScoreOnlyResult | MutationTestResult) {
    if (isMutationTestResult(result)) {
      return calculateMetrics(result.files).metrics.mutationScore;
    } else {
      return result.mutationScore || 0;
    }
  }

  private normalizeResult(result: MutationTestResult): MutationTestResult {
    return {
      ...result,
      files: normalizeFileNames(result.files)
    };
  }
  private createEmptyResult(thresholds: Thresholds): MutationTestResult {
    return {
      files: {},
      schemaVersion: SCHEMA_VERSION,
      thresholds
    };
  }
}
