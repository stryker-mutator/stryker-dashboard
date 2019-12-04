export interface Result<T> { etag: string; entity: T; }

export interface Mapper<TModel, TPartitionKeyFields extends keyof TModel, TRowKeyFields extends keyof TModel> {
  createStorageIfNotExists(): Promise<void>;
  insertOrMerge(model: TModel): Promise<void>;
  insert(model: TModel): Promise<Result<TModel>>;
  replace(model: TModel, etag: string): Promise<Result<TModel>>;
  findOne(identifier: Pick<TModel, TPartitionKeyFields | TRowKeyFields>): Promise<Result<TModel> | null>;
  findAll(identifier: Pick<TModel, TPartitionKeyFields>): Promise<Result<TModel>[]>;
}
