
export default class Project {
  public owner: string;
  public name: string;
  public enabled: boolean;
  public apiKeyHash: string;
  public static readonly persistedFields = ['enabled', 'apiKeyHash'] as const;
  public static readonly tableName = 'Project';
  public static createRowKey(identifier: Pick<Project, 'name'>) {
    return identifier.name;
  }

  public static createPartitionKey(identifier: Pick<Project, 'owner'>) {
    return identifier.owner;
  }

  public static identify(entity: Partial<Project>, partitionKeyValue: string, rowKeyValue: string) {
    entity.name = rowKeyValue;
    entity.owner = partitionKeyValue;
  }
}
