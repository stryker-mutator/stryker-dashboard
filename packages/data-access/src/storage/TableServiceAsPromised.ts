import { promisify } from 'util';
import { TableService, TableQuery, createTableService } from 'azure-storage';

export type Entity<T> = {
  [K in keyof T]: {
    $: string;
    _: T[K];
  };
} & EntityKey;

export interface EntityKey {
  PartitionKey: {
    $: 'Edm.String';
    _: string;
  };
  RowKey: {
    $: 'Edm.String';
    _: string;
  };
}

export default class TableServiceAsPromised {

  constructor(tableService = createTableService()) {
    this.createTableIfNotExists = promisify(tableService.createTableIfNotExists).bind(tableService);
    this.queryEntities = promisify(tableService.queryEntities).bind(tableService) as any;
    this.insertOrMergeEntity = promisify(tableService.insertOrMergeEntity).bind(tableService);
  }

  public createTableIfNotExists: (name: string) => Promise<TableService.TableResult>;
  public queryEntities: <T>(table: string, tableQuery: TableQuery, cancellationToken: TableService.TableContinuationToken | undefined) => Promise<TableService.QueryEntitiesResult<Entity<T> & EntityKey>>;
  public insertOrMergeEntity: (table: string, entity: any) => Promise<TableService.EntityMetadata>;
}
