import { MutationTestResult } from 'mutation-testing-report-schema';
/**
 * Represents the 'new' style of report, containing the actual result data that adheres to the mutation testing schema
 */
export interface Report {
  repositorySlug: string;
  moduleName: string | undefined;
  version: string;
  result: MutationTestResult | undefined;
  mutationScore: number | undefined;
}
