import TableServiceAsPromised from './TableServiceAsPromised';
import { TableService, TableQuery } from 'azure-storage';
import { slashesToSemicolons, semicolonsToSlashes } from './utils';

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
            PartitionKey: this.packKey(entity[this.partitionKeyName] + ''),
            RowKey: this.packKey(entity[this.rowKeyName] + ''),
            ...(entity as any)
        };
        delete data[this.partitionKeyName];
        delete data[this.rowKeyName];
        return this.tableService.insertOrMergeEntity(this.tableName, data);
    }

    protected packKey(input: string){ 
        return slashesToSemicolons(input);
    }

    protected unpackKey(input: string){
        return semicolonsToSlashes(input);
    }

    public select(partitionKey: string, rowKey?: string): Promise<T[]> {
        let tableQuery = new TableQuery().where('PartitionKey eq ?', this.packKey(partitionKey));
        if (rowKey) {
            tableQuery = tableQuery.and('RowKey eq ?', this.packKey(rowKey));
        }
        return this.tableService.queryEntities<T>(this.tableName, tableQuery)
            .then(results => results.entries.map((entity: any) => {
                const value: any = {};
                value[this.partitionKeyName] = this.unpackKey(entity.PartitionKey._);
                value[this.rowKeyName] = this.unpackKey(entity.RowKey._);
                Object.keys(entity).forEach(key => {
                    if (key != 'PartitionKey' && key != 'RowKey' && key != '.metadata' && key != 'Timestamp') {
                        value[key] = entity[key]._;
                    }
                });

                return value;
            }));
    }

    public selectSingleEntity(partitionKey: string, rowKey: string): Promise<T> {
        return this.select(partitionKey, rowKey).then(result => result[0]);
    }
}