import type { TableEntity, TableEntityResult } from '@azure/data-tables';
import { TableClient } from '@azure/data-tables';
import { expect } from 'chai';
import sinon from 'sinon';

import type { Result } from '../../../src/index.js';
import { DashboardQuery, OptimisticConcurrencyError } from '../../../src/index.js';
import TModel from '../../../src/mappers/TableStorageMapper.js';
import { StorageError } from '../../helpers/StorageError.js';

type PagedAsyncIterableIterator = ReturnType<TableClient['listEntities']>;

export class FooModel {
  public partitionId: string;
  public rowId: string;
  public bar: number;

  public static createPartitionKey(entity: Pick<FooModel, 'partitionId'>): string {
    return entity.partitionId;
  }
  public static createRowKey(entity: Pick<FooModel, 'rowId'>): string | undefined {
    return entity.rowId;
  }
  public static identify(entity: FooModel, partitionKeyValue: string, rowKeyValue: string): void {
    entity.partitionId = partitionKeyValue;
    entity.rowId = rowKeyValue;
  }
  public static readonly persistedFields = ['bar'] as const;
  public static readonly tableName = 'FooTable';
}

describe(TModel.name, () => {
  let sut: TModel<FooModel, 'partitionId', 'rowId'>;
  let tableClient: sinon.SinonStubbedInstance<TableClient>;

  beforeEach(() => {
    tableClient = sinon.createStubInstance(TableClient);
    sut = new TModel(FooModel, tableClient);
  });

  describe('createTableIfNotExists', () => {
    it('should create table "FooTable"', async () => {
      tableClient.createTable.resolves();
      await sut.createStorageIfNotExists();
      sinon.assert.calledWith(tableClient.createTable);
    });
  });

  describe('insertOrMerge', () => {
    it('should insert the given model', async () => {
      const expected: FooModel = {
        partitionId: 'github/owner',
        rowId: 'name',
        bar: 42,
      };
      tableClient.upsertEntity.resolves();
      await sut.insertOrMerge(expected);
      sinon.assert.calledWith(tableClient.upsertEntity, {
        partitionKey: 'github;owner',
        rowKey: 'name',
        bar: 42,
      } as object);
      expect(expected.bar).eq(42);
    });
  });

  describe('findOne', () => {
    it('should retrieve the entity from storage', async () => {
      const result = createEntity();
      tableClient.getEntity.resolves(result);
      await sut.findOne({
        partitionId: 'github/partKey',
        rowId: 'row/key',
      });
      sinon.assert.calledWith(tableClient.getEntity, 'github;partKey', 'row;key');
    });

    it('should return null if it resulted in a 404', async () => {
      const error = new StorageError('ResourceNotFound');
      tableClient.getEntity.rejects(error);
      const actualProject = await sut.findOne({
        partitionId: 'github/partKey',
        rowId: 'rowKey',
      });
      expect(actualProject).null;
    });

    it('should return the entity', async () => {
      const expected: FooModel = {
        rowId: 'rowKey',
        partitionId: 'partKey',
        bar: 42,
      };
      tableClient.getEntity.resolves(createEntity(expected, 'etagValue'));
      const actualProjects = await sut.findOne({
        partitionId: 'github/partKey',
        rowId: 'rowKey',
      });
      expect(actualProjects).deep.eq({ model: expected, etag: 'etagValue' });
    });
  });

  describe('findAll', () => {
    it('should query the underlying storage', async () => {
      const expectedQuery = { filter: `PartitionKey eq 'github;partKey'` };
      tableClient.listEntities.returns(createAsyncIterable());
      await sut.findAll(
        DashboardQuery.create(FooModel).wherePartitionKeyEquals({
          partitionId: 'github/partKey',
        }),
      );
      sinon.assert.calledWith(tableClient.listEntities, { queryOptions: expectedQuery });
    });

    it('should return the all entities', async () => {
      const expectedEntities: FooModel[] = [
        { rowId: 'rowKey', partitionId: 'partKey', bar: 142 },
        { rowId: 'rowKey2', partitionId: 'partKey2', bar: 25 },
      ];
      tableClient.listEntities.returns(createAsyncIterable(...expectedEntities.map((entity) => createEntity(entity))));
      const actualProjects = await sut.findAll(
        DashboardQuery.create(FooModel).wherePartitionKeyEquals({
          partitionId: 'github/partKey',
        }),
      );
      expect(actualProjects).deep.eq(expectedEntities.map((model) => ({ model, etag: 'foo-etag' })));
    });
  });

  describe('replace', () => {
    it('should replace entity with given etag', async () => {
      tableClient.updateEntity.resolves({ etag: 'next-etag' });
      const expected: FooModel = {
        bar: 42,
        partitionId: 'partId',
        rowId: 'rowId',
      };
      const expectedResult: Result<FooModel> = {
        model: expected,
        etag: 'next-etag',
      };
      const result = await sut.replace(expected, 'prev-etag');
      expect(result).deep.eq(expectedResult);
      const expectedEntity = createRawEntity(expected);
      sinon.assert.calledWith(tableClient.updateEntity, expectedEntity, 'Replace', {
        etag: 'prev-etag',
      });
    });

    it('should throw a OptimisticConcurrencyError if the UPDATE_CONDITION_NOT_SATISFIED is thrown', async () => {
      tableClient.updateEntity.rejects(new StorageError('UpdateConditionNotSatisfied'));
      await expect(sut.replace({ bar: 24, partitionId: 'part', rowId: 'row' }, 'prev-etag')).rejectedWith(
        OptimisticConcurrencyError,
      );
    });
  });

  describe('insert', () => {
    it('should insert entity', async () => {
      tableClient.createEntity.resolves({ etag: 'next-etag' });
      const expected: FooModel = {
        bar: 42,
        partitionId: 'partId',
        rowId: 'rowId',
      };
      const expectedResult: Result<FooModel> = {
        model: expected,
        etag: 'next-etag',
      };
      const result = await sut.insert(expected);
      expect(result).deep.eq(expectedResult);
      sinon.assert.calledWith(tableClient.createEntity, createRawEntity(expected));
    });

    it('should throw an OptimisticConcurrencyError if the entity already exists', async () => {
      tableClient.createEntity.rejects(new StorageError('EntityAlreadyExists'));
      await expect(sut.insert({ bar: 24, partitionId: 'part', rowId: 'row' })).rejectedWith(OptimisticConcurrencyError);
    });
  });

  describe('delete', () => {
    it('should delete the entity', async () => {
      tableClient.deleteEntity.resolves();
      await sut.delete({
        partitionId: 'partId',
        rowId: 'rowId',
      });
      sinon.assert.calledWith(tableClient.deleteEntity, 'partId', 'rowId');
    });

    it('should not throw if the entity does not exist', async () => {
      tableClient.deleteEntity.rejects(new StorageError('ResourceNotFound'));
      await sut.delete({
        partitionId: 'partId',
        rowId: 'rowId',
      });
    });
  });

  function createRawEntity(overrides?: Partial<FooModel>, etag?: string): TableEntity<Pick<FooModel, 'bar'>> {
    const foo: Pick<FooModel, 'bar'> = {
      bar: overrides?.bar ?? 42,
    };
    function metadata() {
      if (etag) {
        return {
          etag,
        };
      } else {
        return {};
      }
    }
    return {
      partitionKey: overrides?.partitionId ?? 'partKey',
      rowKey: overrides?.rowId ?? 'rowKey',
      ...foo,
      ...metadata(),
    };
  }

  function createEntity(overrides?: Partial<FooModel>, etag = 'foo-etag'): TableEntityResult<FooModel> {
    const foo: FooModel = {
      bar: 42,
      partitionId: 'partKey',
      rowId: 'rowKey',
      ...overrides,
    };
    return {
      partitionKey: foo.partitionId,
      rowKey: foo.rowId,
      etag,
      ...foo,
    };
  }

  /**
   * Utility function to create an async iterable from the given array
   * Used for the listEntities result
   */
  // @ts-expect-error byPage property is missing
  async function* createAsyncIterable<T extends TableEntityResult<object>>(...values: T[]): PagedAsyncIterableIterator {
    for (const value of values) {
      yield await Promise.resolve(value);
    }
  }
});
