export interface ReportStatisticsDto {
  project: string;
  version: string | undefined;

  createdAt: Date;
  pending: number;
  killed: number;
  timeout: number;
  survived: number;
  noCoverage: number;
  runtimeErrors: number;
  compileErrors: number;
  ignored: number;
  totalDetected: number;
  totalUndetected: number;
  totalInvalid: number;
  totalValid: number;
  totalMutants: number;
  totalCovered: number;
  mutationScore: number;
  mutationScoreBasedOnCoveredCode: number;
}
