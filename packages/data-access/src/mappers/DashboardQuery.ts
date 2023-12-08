import { ModelClass } from './ModelClass.js';
import { odata } from "@azure/data-tables"
import { encodeKey } from '../utils.js';

export class DashboardQuery<
  TModel,
  TPartitionKeyFields extends keyof TModel,
  TRowKeyFields extends keyof TModel
> {
  #modelClass: ModelClass<
    TModel,
    TPartitionKeyFields,
    TRowKeyFields
  >;
  #whereConditions: string[]

  private constructor(modelClass: ModelClass<
    TModel,
    TPartitionKeyFields,
    TRowKeyFields
  >, whereConditions: string[]) {
    this.#modelClass = modelClass;
    this.#whereConditions = whereConditions;
  }

  public whereRowKeyNotEquals(
    rowKey: Pick<TModel, TRowKeyFields>
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    // TODO: not(Rowkey eq 'bla') could also be Rowkey ne 'bla'
    const whereCondition = odata`not(RowKey eq ${encodeKey(this.#modelClass.createRowKey(rowKey) || '')})`;
    return new DashboardQuery(this.#modelClass, [
      ...this.#whereConditions,
      whereCondition,
    ]);
  }

  public wherePartitionKeyEquals(
    partitionKey: Pick<TModel, TPartitionKeyFields>
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    const whereCondition = odata`PartitionKey eq ${encodeKey(this.#modelClass.createPartitionKey(partitionKey))}`
    return new DashboardQuery(this.#modelClass, [
      ...this.#whereConditions,
      whereCondition,
    ]);
  }

  public static create<
    TModel,
    TPartitionKeyFields extends keyof TModel,
    TRowKeyFields extends keyof TModel
  >(
    ModelClass: ModelClass<TModel, TPartitionKeyFields, TRowKeyFields>
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    return new DashboardQuery(ModelClass, []);
  }

  public build(): string {
    return this.#whereConditions.reduce((query, whereCondition, index) => {
      if (index === 0) {
        return whereCondition;
      } else {
        return `${query} and ${whereCondition}`;
      }
    }, '');
  }
}
