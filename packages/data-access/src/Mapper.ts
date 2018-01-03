import TableServiceAsPromised from './TableServiceAsPromised';
import { TableService, TableQuery } from 'azure-storage';
import { slashesToSemicolons, semicolonsToSlashes } from './utils';
import { isUndefined } from 'util';

function isDefined<T>(val: T | undefined): val is T {
    return !isUndefined(val);
}

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

    protected packKey(input: string) {
        return slashesToSemicolons(input);
    }

    protected unpackKey(input: string) {
        return semicolonsToSlashes(input);
    }

    public select(partitionKey: string): Promise<T[]>;
    public select(partitionKey: string, rowKey: string): Promise<T | null>;
    public select(partitionKey: string, rowKey?: string): Promise<T[] | T | null> {
        let tableQuery = new TableQuery().where('PartitionKey eq ?', this.packKey(partitionKey));
        if (isDefined(rowKey)) {
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
            })).then(results => {
                if (isDefined(rowKey)) {
                    if (isUndefined(results[0])) {
                        return null;
                    } else {
                        return results[0];
                    }
                } else {
                    return results;
                }
            });
    }
}