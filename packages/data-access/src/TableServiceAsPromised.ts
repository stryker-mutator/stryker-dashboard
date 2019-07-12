import { promisify } from 'util';
import { TableService, TableQuery, createTableService } from 'azure-storage';

export type Entity<T> = {
  [K in keyof T]: {
    $: string;
    _: T[K];
  };
};

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

  constructor(private readonly tableService = createTableService()) {
    this.createTableIfNotExists = promisify(this.tableService.createTableIfNotExists).bind(this.tableService);
    this.queryEntities = promisify(this.tableService.queryEntities).bind(this.tableService) as any;
    this.insertOrMergeEntity = promisify(this.tableService.insertOrMergeEntity).bind(this.tableService);
  }

  public createTableIfNotExists: (name: string) => Promise<TableService.TableResult>;
  public queryEntities: <T>(table: string, tableQuery: TableQuery) => Promise<TableService.QueryEntitiesResult<Entity<T> & EntityKey>>;
  public insertOrMergeEntity: (table: string, entity: any) => Promise<TableService.EntityMetadata>;
}
