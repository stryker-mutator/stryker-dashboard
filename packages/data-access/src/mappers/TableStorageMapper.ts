import { encodeKey, decodeKey, hasErrorCode } from '../utils.js';
import { Mapper, Result } from './Mapper.js';
import { OptimisticConcurrencyError } from '../errors/index.js';
import { ModelClass } from './ModelClass.js';
import { DashboardQuery } from './DashboardQuery.js';
import { TableClient, TableEntity, TableEntityResult } from '@azure/data-tables';
import { createTableClient } from '../services/TableClient.js';

const errCodes = Object.freeze({
  UPDATE_CONDITION_NOT_SATISFIED: 'UpdateConditionNotSatisfied',
  ENTITY_ALREADY_EXISTS: 'EntityAlreadyExists',
  RESOURCE_NOT_FOUND: 'ResourceNotFound',
});

export default class TableStorageMapper<
  TModel extends object,
  TPartitionKeyFields extends keyof TModel,
  TRowKeyFields extends keyof TModel,
> implements Mapper<TModel, TPartitionKeyFields, TRowKeyFields>
{
  readonly #tableClient: TableClient;

  constructor(
    private readonly ModelClass: ModelClass<TModel, TPartitionKeyFields, TRowKeyFields>,
    tableClient: TableClient = createTableClient(ModelClass.name),
  ) {
    this.#tableClient = tableClient;
  }

  public async createStorageIfNotExists(): Promise<void> {
    await this.#tableClient.createTable();
  }

  public async insertOrMerge(model: TModel) {
    const entity = this.toEntity(model);
    await this.#tableClient.upsertEntity(entity, 'Merge');
  }

  public async findOne(identity: Pick<TModel, TPartitionKeyFields | TRowKeyFields>): Promise<Result<TModel> | null> {
    try {
      const result = await this.#tableClient.getEntity<TModel>(
        encodeKey(this.ModelClass.createPartitionKey(identity)),
        encodeKey(this.ModelClass.createRowKey(identity) || ''),
      );
      return this.toModel(result);
    } catch (err) {
      if (hasErrorCode(err, errCodes.RESOURCE_NOT_FOUND)) {
        return null;
      } else {
        // Oops... didn't mean to catch this one
        throw err;
      }
    }
  }

  public async findAll(
    query: DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> = DashboardQuery.create(this.ModelClass),
  ): Promise<Result<TModel>[]> {
    const tableQuery = query.build();
    const entities = this.#tableClient.listEntities<TModel>({ queryOptions: tableQuery });

    const results: Result<TModel>[] = [];
    for await (const entity of entities) {
      results.push(this.toModel(entity));
    }
    return results;
  }

  /**
   * Replace an entity of a specific version (throws error otherwise)
   * @param model The model to replace
   * @param etag The etag (version id)
   * @throws {OptimisticConcurrencyError}
   */
  public async replace(model: TModel, etag: string): Promise<Result<TModel>> {
    const entity = this.toEntity(model);
    try {
      const result = await this.#tableClient.updateEntity(entity, 'Replace', { etag });
      return { model, etag: result.etag! };
    } catch (err) {
      if (hasErrorCode(err, errCodes.UPDATE_CONDITION_NOT_SATISFIED)) {
        throw new OptimisticConcurrencyError(
          `Replace entity with etag ${etag} resulted in ${errCodes.UPDATE_CONDITION_NOT_SATISFIED}`,
        );
      } else {
        throw err;
      }
    }
  }

  public async insert(model: TModel): Promise<Result<TModel>> {
    const entity = this.toEntity(model);
    try {
      const result = await this.#tableClient.createEntity(entity);
      return { model, etag: result.etag! };
    } catch (err) {
      if (hasErrorCode(err, errCodes.ENTITY_ALREADY_EXISTS)) {
        throw new OptimisticConcurrencyError(
          `Trying to insert "${entity.partitionKey}" "${entity.rowKey}" which already exists (${errCodes.ENTITY_ALREADY_EXISTS})`,
        );
      } else {
        throw err;
      }
    }
  }

  private toModel(entity: TableEntityResult<TModel>): Result<TModel> {
    const value = new this.ModelClass();
    this.ModelClass.identify(value, decodeKey(entity.partitionKey!), decodeKey(entity.rowKey!));
    this.ModelClass.persistedFields.forEach((field) => (value[field] = entity[field]));
    return {
      etag: entity.etag,
      model: value,
    };
  }

  private toEntity(entity: TModel): TableEntity<TModel> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: TableEntity<any> = {
      partitionKey: encodeKey(this.ModelClass.createPartitionKey(entity)),
      rowKey: encodeKey(this.ModelClass.createRowKey(entity) || ''),
    };
    this.ModelClass.persistedFields.forEach((field) => (data[field] = entity[field]));

    return data;
  }
}
