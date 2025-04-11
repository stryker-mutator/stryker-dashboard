import { type Metrics } from "mutation-testing-metrics";

export class MutationTestingMetrics implements Metrics {
  public project: string; // github.com/stryker-mutator/stryker-dashboard
  public version: string | undefined; // feat/implement-metrics

  public createdAt: Date;
  public pending: number;
  public killed: number;
  public timeout: number;
  public survived: number;
  public noCoverage: number;
  public runtimeErrors: number;
  public compileErrors: number;
  public ignored: number;
  public totalDetected: number;
  public totalUndetected: number;
  public totalInvalid: number;
  public totalValid: number;
  public totalMutants: number;
  public totalCovered: number;
  public mutationScore: number;
  public mutationScoreBasedOnCoveredCode: number;

  constructor(metrics: Metrics | undefined = undefined) {
    if (metrics === undefined) {
      return;
    }
    
    this.createdAt = new Date();
    this.pending = metrics.pending;
    this.killed = metrics.killed;
    this.timeout = metrics.timeout;
    this.survived = metrics.survived;
    this.noCoverage = metrics.noCoverage;
    this.runtimeErrors = metrics.runtimeErrors;
    this.compileErrors = metrics.compileErrors;
    this.ignored = metrics.ignored;
    this.totalDetected = metrics.totalDetected;
    this.totalUndetected = metrics.totalUndetected;
    this.totalInvalid = metrics.totalInvalid;
    this.totalValid = metrics.totalValid;
    this.totalMutants = metrics.totalMutants;
    this.totalCovered = metrics.totalCovered;
    this.mutationScore = metrics.mutationScore;
    this.mutationScoreBasedOnCoveredCode = metrics.mutationScoreBasedOnCoveredCode;
  }

  public static readonly persistedFields = [
    'pending', 
    'killed',
    'timeout',
    'survived',
    'noCoverage',
    'runtimeErrors',
    'compileErrors',
    'ignored',
    'totalDetected',
    'totalUndetected',
    'totalInvalid',
    'totalValid',
    'totalMutants',
    'totalCovered',
    'mutationScore',
    'mutationScoreBasedOnCoveredCode',
  ] as const;
  public static readonly tableName = MutationTestingMetrics.name;

  public static createRowKey(identifier: Pick<MutationTestingMetrics, 'version'>): string | undefined {
    const nowUtc = new Date().toISOString();
    return identifier.version + nowUtc;
  }

  public static createPartitionKey(identifier: Pick<MutationTestingMetrics, 'project'>): string {
    return identifier.project;
  }

  public static identify(entity: Partial<MutationTestingMetrics>, partitionKey: string, rowKey: string) {
    entity.project = partitionKey;
    entity.version = rowKey;
  }
}
