import { Constants } from 'azure-storage';
import { encodeKey, decodeKey, isStorageError } from '../utils.js';
import { Mapper, Result } from './Mapper.js';
import { OptimisticConcurrencyError } from '../errors/index.js';
import { ModelClass } from './ModelClass.js';
import { DashboardQuery } from './DashboardQuery.js';
import { TableClient } from '@azure/data-tables';

type Entity<T, TKeyFields extends keyof T> = {
  [K in Exclude<keyof T, TKeyFields>]: {
    $: string;
    _: T[K];
  };
} & EntityKey &
  EntityMetadata;

interface EntityKey {
  // TODO: is this correct?
  partitionKey: string
  rowKey: string;
}

interface EntityMetadata {
  ['.metadata']: {
    etag: string;
  };
}

export default class TableStorageMapper<
  TModel extends object,
  TPartitionKeyFields extends keyof TModel,
  TRowKeyFields extends keyof TModel
> implements Mapper<TModel, TPartitionKeyFields, TRowKeyFields>
{
  #model: ModelClass<
    TModel,
    TPartitionKeyFields,
    TRowKeyFields
  >;
  #tableClient: TableClient;

  constructor(model: ModelClass<
      TModel,
      TPartitionKeyFields,
      TRowKeyFields
    >,
    tableClient = TableClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]!, model.tableName)
  ) {
    this.#model = model;
    this.#tableClient = tableClient;
  }

  public async createStorageIfNotExists(): Promise<void> {
    await this.#tableClient.createTable();
  }

  public async insertOrMerge(model: TModel) {
    const entity = this.toEntity(model);
    await this.#tableClient.upsertEntity(entity);
  }

  public async findOne(
    identity: Pick<TModel, TPartitionKeyFields | TRowKeyFields>
  ): Promise<Result<TModel> | null> {
    try {
      const result = await this.#tableClient.getEntity<
        Entity<TModel, TPartitionKeyFields | TRowKeyFields>
      >(
        encodeKey(this.#model.createPartitionKey(identity)),
        encodeKey(this.#model.createRowKey(identity) || '')
      );
      return this.toModel(result);
    } catch (err) {
      throw err;
    }
  }

  public async findAll(
    query: DashboardQuery<
      TModel,
      TPartitionKeyFields,
      TRowKeyFields
    > = DashboardQuery.create(this.#model)
  ): Promise<Result<TModel>[]> {
    const tableQuery = query.build();
    const entities = this.#tableClient.listEntities<TModel>({ queryOptions: { filter: tableQuery } });
    const models = []
    for await (const entity of entities) {
      // TODO: fix
      models.push(this.toModel(entity as any))
    }
    return models;
  }

  /**
   * Replace an entity of a specific version (throws error otherwise)
   * @param model The model to replace
   * @param etag The etag (version id)
   * @throws {OptimisticConcurrencyError}
   */
  public async replace(model: TModel, etag: string): Promise<Result<TModel>> {
    const entity = this.toEntity(model);
    entity['.metadata'].etag = etag;
    try {
      const result = await this.#tableClient.upsertEntity(entity, "Replace");
      return { model, etag: result.etag! };
    } catch (err) {
      throw err;
    }
  }

  public async insert(model: TModel): Promise<Result<TModel>> {
    const entity = this.toEntity(model);
    try {
      const result = await this.#tableClient.createEntity(entity);
      return { model, etag: result.etag! };
    } catch (err) {
      throw err;
    }
  }

  private toModel(
    entity: Entity<TModel, TPartitionKeyFields | TRowKeyFields>
  ): Result<TModel> {
    const value = new this.#model();
    this.#model.identify(
      value,
      decodeKey(entity.partitionKey),
      decodeKey(entity.rowKey)
    );
    this.#model.persistedFields.forEach(
      (field) => ((value[field] as any) = (entity as any)[field]._)
    );
    return {
      etag: entity['.metadata'].etag,
      model: value,
    };
  }

  private toEntity(
    entity: TModel
  ): Entity<TModel, TPartitionKeyFields | TRowKeyFields> {
    const data: any = {
      partitionKey: encodeKey(this.#model.createPartitionKey(entity)),
      rowKey: encodeKey(this.#model.createRowKey(entity) || ''),
    };
    this.#model.persistedFields.forEach((field) => (data[field] = entity[field]));
    // data['.metadata'] = {};
    return data;
  }
}
