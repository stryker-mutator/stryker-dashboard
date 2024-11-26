import type { MutationTestResult } from 'mutation-testing-report-schema';

export interface MutationScoreOnlyResult {
  mutationScore: number;
}

export interface ReportIdentifier {
  projectName: string;
  moduleName: string | undefined;
  realTime?: boolean;
  version: string;
}

/**
 * Represents the report
 */
export type Report =
  | (ReportIdentifier & MutationScoreOnlyResult)
  | (ReportIdentifier & MutationScoreOnlyResult & MutationTestResult);

export function isMutationTestResult(
  report: MutationScoreOnlyResult | MutationTestResult,
): report is MutationTestResult {
  return !!(report as MutationTestResult).files;
}

export function isPendingReport(report: MutationTestResult) {
  return Object.values(report.files)
    .flatMap((file) => file.mutants)
    .some((mutant) => mutant.status === 'Pending');
}
