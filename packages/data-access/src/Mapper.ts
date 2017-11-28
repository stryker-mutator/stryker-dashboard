import TableServiceAsPromised from './TableServiceAsPromised';
import { TableService, TableQuery } from 'azure-storage';

export default abstract class Mapper<T> {
    constructor(private tableName: string,
        private partitionKeyName: keyof T,
        private rowKeyName: keyof T,
        private tableService: TableServiceAsPromised) {
    }

    public createTableIfNotExists(): Promise<TableService.TableResult> {
        return this.tableService.createTableIfNotExists(this.tableName);
    }

    public insertOrMergeEntity(entity: T) {
        const data = {
            PartitionKey: entity[this.partitionKeyName],
            RowKey: entity[this.rowKeyName],
            ...(entity as any)
        };
        delete data[this.partitionKeyName];
        delete data[this.rowKeyName];
        return this.tableService.insertOrMergeEntity(this.tableName, data);
    }

    public select(partitionKey: string, rowKey?: string): Promise<T[]> {
        let tableQuery = new TableQuery().where('PartitionKey eq ?', partitionKey);
        if (rowKey) {
            tableQuery = tableQuery.and('RowKey eq ?', rowKey);
        }
        return this.tableService.queryEntities<T>(this.tableName, tableQuery)
            .then(results => results.entries.map((entity: any) => {
                const value: any = {};
                value[this.partitionKeyName] = entity.PartitionKey._;
                value[this.rowKeyName] = entity.RowKey._;
                Object.keys(entity).forEach(key => {
                    if (key != 'PartitionKey' && key != 'RowKey' && key != '.metadata' && key != 'Timestamp') {
                        value[key] = entity[key]._;
                    }
                });

                return value;
            }));
    }

}