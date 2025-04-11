import type { Logger, MutationScoreOnlyResult, Report, ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { isMutationTestResult } from '@stryker-mutator/dashboard-common';
import type { Metrics } from 'mutation-testing-metrics';
import { aggregateResultsByModule, calculateMetrics } from 'mutation-testing-metrics';
import type { MutationTestResult } from 'mutation-testing-report-schema';

import { OptimisticConcurrencyError } from '../errors/index.js';
import type { MutationTestingMetricsMapper, MutationTestingReportMapper } from '../mappers/index.js';
import { createMutationTestingMetricsMapper, createMutationTestingReportMapper, DashboardQuery } from '../mappers/index.js';
import { MutationTestingResultMapper } from '../mappers/MutationTestingResultMapper.js';
import { MutationTestingReport } from '../models/index.js';
import { MutationTestingMetrics } from '../models/MutationTestingMetrics.js';

function moduleHasResult(tuple: readonly [string, MutationTestResult | null]): tuple is [string, MutationTestResult] {
  return !!tuple[1];
}

export class MutationTestingReportService {
  constructor(
    private readonly resultMapper: MutationTestingResultMapper = new MutationTestingResultMapper(),
    private readonly mutationMetricsMapper: MutationTestingMetricsMapper = createMutationTestingMetricsMapper(),
    private readonly mutationScoreMapper: MutationTestingReportMapper = createMutationTestingReportMapper(),
  ) {}

  public async createStorageIfNotExists() {
    await this.resultMapper.createStorageIfNotExists();
    await this.mutationScoreMapper.createStorageIfNotExists();
  }

  public async saveReport(id: ReportIdentifier, result: MutationScoreOnlyResult | MutationTestResult, logger: Logger) {
    let metrics: Metrics | undefined;
    if (isMutationTestResult(result)){
      metrics = calculateMetrics(result.files).metrics;
    }
    const mutationScore = metrics?.mutationScore || 0;

    await this.insertOrMergeReport(
      id,
      {
        ...id,
        mutationScore,
      },
      isMutationTestResult(result) ? result : null,
    );
    if (isMutationTestResult(result) && id.moduleName) {
      await this.aggregateProjectReport(id.projectName, id.version, logger);
    }
    if (metrics) {
      const mutationTestingMetrics = new MutationTestingMetrics(metrics);

      mutationTestingMetrics.project = id.projectName;
      mutationTestingMetrics.version = id.version;
      
      await this.mutationMetricsMapper.insert(mutationTestingMetrics)
    }
  }

  private async aggregateProjectReport(projectName: string, version: string, logger: Logger) {
    const id: ReportIdentifier = {
      projectName,
      version,
      moduleName: undefined,
    };

    while (!(await this.tryAggregateProjectReport(id))) {
      logger.log({
        message: `Optimistic concurrency exception occurred while trying to aggregate the report ${JSON.stringify(
          id,
        )}, retrying...`,
      });
    }
  }

  private async tryAggregateProjectReport(id: ReportIdentifier) {
    const projectMutationScoreModel = await this.mutationScoreMapper.findOne(id);
    const moduleScoreResults = await this.mutationScoreMapper.findAll(
      DashboardQuery.create(MutationTestingReport)
        .wherePartitionKeyEquals(id)
        .whereRowKeyNotEquals({ moduleName: undefined }),
    );
    const resultsByModule = Object.fromEntries(
      (
        await Promise.all(
          moduleScoreResults.map(
            async (score) => [score.model.moduleName!, await this.resultMapper.findOne(score.model)] as const,
          ),
        )
      ).filter(moduleHasResult),
    );
    if (Object.keys(resultsByModule).length) {
      const projectResult = aggregateResultsByModule(resultsByModule);
      const projectReport: MutationTestingReport = {
        ...id,
        mutationScore: this.calculateMutationScore(projectResult),
      };
      try {
        await this.resultMapper.insertOrReplace(id, projectResult);
        if (projectMutationScoreModel) {
          await this.mutationScoreMapper.replace(projectReport, projectMutationScoreModel.etag);
        } else {
          await this.mutationScoreMapper.insert(projectReport);
        }
      } catch (err) {
        if (err instanceof OptimisticConcurrencyError) {
          return false;
        } else {
          throw err;
        }
      }
    }
    return true;
  }

  public async findOne(id: ReportIdentifier): Promise<Report | null> {
    const [reportEntity, result] = await Promise.all([
      this.mutationScoreMapper.findOne(id),
      this.resultMapper.findOne(id),
    ]);
    if (reportEntity) {
      if (result) {
        return {
          ...id,
          mutationScore: reportEntity.model.mutationScore,
          ...result,
        };
      } else {
        return { ...id, mutationScore: reportEntity.model.mutationScore };
      }
    } else {
      return null;
    }
  }

  public async delete(id: ReportIdentifier): Promise<void> {
    await this.resultMapper.delete(id);
  }

  private async insertOrMergeReport(
    id: ReportIdentifier,
    report: MutationTestingReport,
    result: MutationTestResult | null,
  ) {
    await Promise.all([this.resultMapper.insertOrReplace(id, result), this.mutationScoreMapper.insertOrMerge(report)]);
  }

  private calculateMutationScore(result: MutationScoreOnlyResult | MutationTestResult) {
    if (isMutationTestResult(result)) {
      return calculateMetrics(result.files).metrics.mutationScore;
    } else {
      return result.mutationScore || 0;
    }
  }
}
