import { ModelClass } from './ModelClass.js';
import { encodeKey } from '../utils.js';
import { TableEntityQueryOptions, odata } from '@azure/data-tables';

export class DashboardQuery<TModel, TPartitionKeyFields extends keyof TModel, TRowKeyFields extends keyof TModel> {
  private constructor(
    protected ModelClass: ModelClass<TModel, TPartitionKeyFields, TRowKeyFields>,
    private readonly whereConditions: string[],
  ) {}

  public whereRowKeyNotEquals(
    rowKey: Pick<TModel, TRowKeyFields>,
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    const whereCondition: string = odata`RowKey ne ${encodeKey(this.ModelClass.createRowKey(rowKey) || '')}`;

    return new DashboardQuery(this.ModelClass, [...this.whereConditions, whereCondition]);
  }

  public wherePartitionKeyEquals(
    partitionKey: Pick<TModel, TPartitionKeyFields>,
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    const whereCondition: string = odata`PartitionKey eq ${encodeKey(this.ModelClass.createPartitionKey(partitionKey))}`;
    return new DashboardQuery(this.ModelClass, [...this.whereConditions, whereCondition]);
  }

  public static create<TModel, TPartitionKeyFields extends keyof TModel, TRowKeyFields extends keyof TModel>(
    ModelClass: ModelClass<TModel, TPartitionKeyFields, TRowKeyFields>,
  ): DashboardQuery<TModel, TPartitionKeyFields, TRowKeyFields> {
    return new DashboardQuery(ModelClass, []);
  }

  public build(): TableEntityQueryOptions {
    return this.whereConditions.reduce<TableEntityQueryOptions>((tableQuery, whereCondition, index) => {
      if (index === 0) {
        return { filter: whereCondition };
      } else {
        return { filter: `${tableQuery.filter} and ${whereCondition}` };
      }
    }, {});
  }
}
