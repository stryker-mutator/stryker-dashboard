import type { ReportIdentifier } from '@stryker-mutator/dashboard-common';

export class MutationTestingReport implements ReportIdentifier{
  /**
   * The repo slug. /:provider/:owner/:name (could also have more components in the future, for example gitlab supports this)
   * @example /github.com/stryker-mutator/mutation-testing-elements
   */
  public projectName: string;
  /**
   * The branch, tag or git hash
   * @example 'master', 'v1', '0d3af4840904c42dede7016f45b53718a617bbd8'
   */
  public version: string;
  /**
   * Optional: the module
   * For example 'schema'
   */
  public moduleName: string | undefined;
  /**
   * Indicates whether this report is real-time.
   */
  public realTime?: boolean;
  public mutationScore: number;

  public static createRowKey(identifier: Pick<MutationTestingReport, 'moduleName'>) {
    return identifier.moduleName;
  }

  public static createPartitionKey(identifier: Pick<MutationTestingReport, 'version' | 'projectName'>) {
    return `${identifier.projectName}/${identifier.version}`;
  }

  public static identify(entity: Partial<MutationTestingReport>, partitionKeyValue: string, rowKeyValue: string) {
    const versionSplit = partitionKeyValue.lastIndexOf('/');
    entity.projectName = partitionKeyValue.substr(0, versionSplit);
    entity.version = partitionKeyValue.substr(versionSplit + 1);
    entity.moduleName = rowKeyValue;
  }
  public static readonly persistedFields = ['mutationScore'] as const;
  public static readonly tableName = 'MutationTestingReport';
}
