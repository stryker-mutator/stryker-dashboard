import { MutationTestResult } from 'mutation-testing-report-schema';
import { normalizeFileNames } from 'mutation-testing-metrics';
import { calculateMetrics } from 'mutation-testing-metrics';
import { MutationTestingResultMapper } from '../mappers/MutationTestingResultMapper';
import { MutationTestingReportMapper, createMutationTestingReportMapper } from '../mappers';
import { MutationScoreOnlyResult, isMutationTestResult, ReportIdentifier, Report } from '@stryker-mutator/dashboard-common';
import { MutationTestingReport } from '../models';

export class MutationTestingReportService {

  constructor(
    private readonly resultMapper: MutationTestingResultMapper = new MutationTestingResultMapper(),
    private readonly mutationScoreMapper: MutationTestingReportMapper = createMutationTestingReportMapper()) {
  }

  public async saveReport(id: ReportIdentifier, result: MutationScoreOnlyResult | MutationTestResult) {
    const mutationScore = this.calculateMutationScore(result);

    await this.insertOrMergeReport(id, {
      ...id,
      mutationScore
    }, isMutationTestResult(result) ? this.normalizeResult(result) : null);
  }

  public async findOne(id: ReportIdentifier): Promise<Report | null> {
    const [reportEntity, result] = await Promise.all([this.mutationScoreMapper.findOne(id), this.resultMapper.findOne(id)]);
    if (result && reportEntity) {
      return {
        ...id,
        mutationScore: reportEntity.entity.mutationScore,
        ...result
      };
    } else {
      return null;
    }
  }

  private async insertOrMergeReport(id: ReportIdentifier, report: MutationTestingReport, result: MutationTestResult | null) {
    await Promise.all([
      this.resultMapper.insertOrMergeEntity(id, result),
      this.mutationScoreMapper.insertOrMergeEntity(report)
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
}
