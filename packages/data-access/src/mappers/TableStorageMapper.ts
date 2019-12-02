import { TableQuery, Constants } from 'azure-storage';
import TableServiceAsPromised, { Entity } from '../services/TableServiceAsPromised';
import { encodeKey, decodeKey, isStorageError } from '../utils';
import { Mapper, Result } from './Mapper';

interface EntityClass<T, TPartitionKeyFields extends keyof T, TRowKeyFields extends keyof T> {
  new(): T;
  createPartitionKey(entity: Pick<T, TPartitionKeyFields>): string;
  createRowKey(entity: Pick<T, TRowKeyFields>): string | undefined;
  identify(entity: Partial<T>, partitionKeyValue: string, rowKeyValue: string): void;
  readonly persistedFields: ReadonlyArray<Exclude<keyof T, TRowKeyFields>>;
  readonly tableName: string;
}

export default class TableStorageMapper<T extends object, TPartitionKeyFields extends keyof T, TRowKeyFields extends keyof T>
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

  public async findOne(identity: Pick<T, TPartitionKeyFields | TRowKeyFields>): Promise<Result<T> | null> {
    try {
      const result = await this.tableService.retrieveEntity<Entity<T, TPartitionKeyFields | TRowKeyFields>>(
        this.EntityClass.tableName,
        this.EntityClass.createPartitionKey(identity),
        this.EntityClass.createRowKey(identity) || '');
      return this.mapEntity(result);
    } catch (err) {
      if (isStorageError(err) && err.code === Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND) {
        return null;
      }
      else {
        // Oops... didn't mean to catch this one
        throw err;
      }
    }
  }

  public async findAll(identity: Pick<T, TPartitionKeyFields>): Promise<Result<T>[]> {
    const tableQuery = this.createSelectByPartitionKeyQuery(identity);
    const results = await this.tableService.queryEntities<T, TPartitionKeyFields | TRowKeyFields>(this.EntityClass.tableName, tableQuery, undefined);
    return results.entries.map(entity => this.mapEntity(entity));
  }

  private mapEntity(entity: Entity<T, TPartitionKeyFields | TRowKeyFields>): Result<T> {
    const value = new this.EntityClass();
    this.EntityClass.identify(value, decodeKey(entity.PartitionKey._), decodeKey(entity.RowKey._));
    this.EntityClass.persistedFields.forEach(field => (value[field] as any) = (entity as any)[field]._);
    return {
      etag: entity['.metadata'].etag,
      entity: value
    };
  }

  private createSelectByPartitionKeyQuery(identity: Pick<T, TPartitionKeyFields>) {
    return new TableQuery().where('PartitionKey eq ?', encodeKey(this.EntityClass.createPartitionKey(identity)));
  }
}
