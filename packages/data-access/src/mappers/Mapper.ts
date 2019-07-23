export interface Mapper<TEntity, TPartitionKeyFields extends keyof TEntity, TRowKeyFields extends keyof TEntity> {
  createStorageIfNotExists(): Promise<void>;
  insertOrMergeEntity(entity: TEntity): Promise<void>;
  findOne(identifier: Pick<TEntity, TPartitionKeyFields | TRowKeyFields>): Promise<TEntity | null>;
  findAll(identifier: Pick<TEntity, TPartitionKeyFields>): Promise<TEntity[]>;
}
