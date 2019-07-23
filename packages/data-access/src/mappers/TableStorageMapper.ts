import { TableQuery } from 'azure-storage';
import TableServiceAsPromised, { Entity } from '../storage/TableServiceAsPromised';
import { encodeKey, decodeKey } from '../utils';
import { Mapper } from './Mapper';

interface EntityClass<T, TPartitionKeyFields extends keyof T, TRowKeyFields extends keyof T> {
  new(): T;
  createPartitionKey(entity: Pick<T, TPartitionKeyFields>): string;
  createRowKey(entity: Pick<T, TRowKeyFields>): string | undefined;
  identify(entity: Partial<T>, partitionKeyValue: string, rowKeyValue: string): void;
  readonly persistedFields: ReadonlyArray<keyof T>;
  readonly tableName: string;
}

export default class TableStorageMapper<T, TPartitionKeyFields extends keyof T, TRowKeyFields extends keyof T>
  implements Mapper<T, TPartitionKeyFields, TRowKeyFields> {
  constructor(
    private readonly EntityClass: EntityClass<T, TPartitionKeyFields, TRowKeyFields>,
    private readonly tableService: TableServiceAsPromised = new TableServiceAsPromised()) {
  }

  public async createStorageIfNotExists(): Promise<void> {
    await this.tableService.createTableIfNotExists(this.EntityClass.tableName);
  }

  public async insertOrMergeEntity(entity: T) {
    const data: any = {
      PartitionKey: encodeKey(this.EntityClass.createPartitionKey(entity)),
      RowKey: encodeKey(this.EntityClass.createRowKey(entity) || ''),
    };
    this.EntityClass.persistedFields.forEach(field => data[field] = entity[field]);
    await this.tableService.insertOrMergeEntity(this.EntityClass.tableName, data);
  }

  public async findOne(identity: Pick<T, TPartitionKeyFields | TRowKeyFields>): Promise<T | null> {
    const tableQuery = this.createSelectByPartitionKeyQuery(identity)
      .and('RowKey eq ?', encodeKey(this.EntityClass.createRowKey(identity) || ''));
    const results = await this.tableService.queryEntities<T>(this.EntityClass.tableName, tableQuery, undefined);
    if (results.entries.length) {
      return this.toModel(results.entries[0]);
    } else {
      return null;
    }
  }

  public async findAll(identity: Pick<T, TPartitionKeyFields>): Promise<T[]> {
    const tableQuery = this.createSelectByPartitionKeyQuery(identity);
    const results = await this.tableService.queryEntities<T>(this.EntityClass.tableName, tableQuery, undefined);
    return results.entries.map(entity => this.toModel(entity));
  }

  private toModel(entity: Entity<T>): T {
    const value: T = new this.EntityClass();
    this.EntityClass.identify(value, decodeKey(entity.PartitionKey._), decodeKey(entity.RowKey._));
    this.EntityClass.persistedFields.forEach(field => (value[field] as any) = entity[field]._);
    return value;
  }

  private createSelectByPartitionKeyQuery(identity: Pick<T, TPartitionKeyFields>) {
    return new TableQuery().where('PartitionKey eq ?', encodeKey(this.EntityClass.createPartitionKey(identity)));
  }
}
