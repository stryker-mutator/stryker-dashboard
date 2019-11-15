import { MutationTestResult } from 'mutation-testing-report-schema';

export interface MutationScoreOnlyResult {
  mutationScore: number;
}

export interface ReportIdentifier {
  projectName: string;
  moduleName: string | undefined;
  version: string;
}

/**
 * Represents the report
 */
export type Report = (ReportIdentifier & MutationScoreOnlyResult) | (ReportIdentifier & MutationScoreOnlyResult & MutationTestResult);

export function isMutationTestResult(report: MutationScoreOnlyResult | MutationTestResult)
  : report is MutationTestResult {
  return !!((report as MutationTestResult).files);
}
