import { isUndefined } from 'util';
import { ErrorOrResult, TableService, TableQuery, createTableService } from 'azure-storage';
const { promisify } = require('es6-promisify');

export type Entity<T> = {
    [K in keyof T]: {
        $: string;
        _: T[K];
    };
}

export interface EntityKey {
    PartitionKey: {
        $: 'Edm.String';
        _: string;
    };
    RowKey: {
        $: 'Edm.String';
        _: string;
    };
}

export default class TableServiceAsPromised {

    constructor(private tableService = createTableService()) {
    }

    public createTableIfNotExists(name: string): Promise<TableService.TableResult> {
        return this.promisify(this.tableService.createTableIfNotExists, name);
    }

    public insertOrMergeEntity(table: string, entity: any) {
        return this.promisify(this.tableService.insertOrMergeEntity, table, entity);
    }

    public queryEntities<T>(table: string, tableQuery: TableQuery): Promise<TableService.QueryEntitiesResult<Entity<T> & EntityKey>> {
        return this.promisify(this.tableService.queryEntities, table, tableQuery, null as any);
    }

    private promisify<T1, TResult>(action: (arg: T1, callback: ErrorOrResult<TResult>) => void, arg: T1): Promise<TResult>
    private promisify<T1, T2, TResult>(action: (arg: T1, arg2: T2, callback: ErrorOrResult<TResult>) => void, arg: T1, arg2: T2): Promise<TResult>
    private promisify<T1, T2, T3, TResult>(action: (arg: T1, arg2: T2, arg3: T3, callback: ErrorOrResult<TResult>) => void, arg: T1, arg2: T2, arg3: T3): Promise<TResult>
    private promisify<T1, T2, T3, TResult>(action: (...args: any[]) => any, arg: T1, arg2?: T2, arg3?: T3): Promise<TResult> {
        const args: (T1 | T2 | T3)[] = [arg];
        if (!isUndefined(arg2)) {
            args.push(arg2);
        }
        if (!isUndefined(arg3)) {
            args.push(arg3);
        }
        return promisify(action).apply(this.tableService, args);
    }
}