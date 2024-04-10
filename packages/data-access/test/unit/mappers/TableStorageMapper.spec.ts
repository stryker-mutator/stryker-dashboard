import TModel from '../../../src/mappers/TableStorageMapper.js';
import TableServiceAsPromised, { Entity } from '../../../src/services/TableServiceAsPromised.js';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { TableQuery, Constants } from 'azure-storage';
import { StorageError } from '../../helpers/StorageError.js';
import { Result, OptimisticConcurrencyError, DashboardQuery } from '../../../src/index.js';

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
  class TestHelper {
    public tableServiceAsPromisedMock: sinon.SinonStubbedInstance<TableServiceAsPromised> = {
      createTableIfNotExists: sinon.stub(),
      insertOrMergeEntity: sinon.stub(),
      queryEntities: sinon.stub<any, any>(),
      retrieveEntity: sinon.stub<any, any>(),
      insertEntity: sinon.stub(),
      replaceEntity: sinon.stub(),
    };
    public sut = new TModel(FooModel, this.tableServiceAsPromisedMock as any);
  }
  let helper: TestHelper;

  beforeEach(() => {
    helper = new TestHelper();
  });

  describe('createTableIfNotExists', () => {
    it('should create table "FooTable"', async () => {
      helper.tableServiceAsPromisedMock.createTableIfNotExists.resolves();
      await helper.sut.createStorageIfNotExists();
      expect(helper.tableServiceAsPromisedMock.createTableIfNotExists).calledWith('FooTable');
    });
  });

  describe('insertOrMerge', () => {
    it('should insert the given model', async () => {
      const expected: FooModel = {
        partitionId: 'github/owner',
        rowId: 'name',
        bar: 42,
      };
      helper.tableServiceAsPromisedMock.insertOrMergeEntity.resolves();
      await helper.sut.insertOrMerge(expected);
      expect(helper.tableServiceAsPromisedMock.insertOrMergeEntity).calledWith('FooTable', {
        PartitionKey: 'github;owner',
        RowKey: 'name',
        bar: 42,
        ['.metadata']: {},
      });
      expect(expected.bar).eq(42);
    });
  });

  describe('findOne', () => {
    it('should retrieve the entity from storage', async () => {
      const result = createEntity();
      helper.tableServiceAsPromisedMock.retrieveEntity.resolves(result);
      await helper.sut.findOne({
        partitionId: 'github/partKey',
        rowId: 'row/key',
      });
      expect(helper.tableServiceAsPromisedMock.retrieveEntity).calledWith(
        'FooTable',
        'github;partKey',
        'row;key',
      );
    });

    it('should return null if it resulted in a 404', async () => {
      const error = new StorageError(Constants.StorageErrorCodeStrings.RESOURCE_NOT_FOUND);
      helper.tableServiceAsPromisedMock.retrieveEntity.rejects(error);
      const actualProject = await helper.sut.findOne({
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
      helper.tableServiceAsPromisedMock.retrieveEntity.resolves(
        createEntity(expected, 'etagValue'),
      );
      const actualProjects = await helper.sut.findOne({
        partitionId: 'github/partKey',
        rowId: 'rowKey',
      });
      expect(actualProjects).deep.eq({ model: expected, etag: 'etagValue' });
    });
  });

  describe('findAll', () => {
    it('should query the underlying storage', async () => {
      const expectedQuery = new TableQuery().where('PartitionKey eq ?', 'github;partKey');
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: [] });
      await helper.sut.findAll(
        DashboardQuery.create(FooModel).wherePartitionKeyEquals({
          partitionId: 'github/partKey',
        }),
      );
      expect(helper.tableServiceAsPromisedMock.queryEntities).calledWith('FooTable', expectedQuery);
    });

    it('should return the all entities', async () => {
      const expectedEntities: FooModel[] = [
        { rowId: 'rowKey', partitionId: 'partKey', bar: 142 },
        { rowId: 'rowKey2', partitionId: 'partKey2', bar: 25 },
      ];
      helper.tableServiceAsPromisedMock.queryEntities.resolves({
        entries: expectedEntities.map((entity) => createEntity(entity)),
      });
      const actualProjects = await helper.sut.findAll(
        DashboardQuery.create(FooModel).wherePartitionKeyEquals({
          partitionId: 'github/partKey',
        }),
      );
      expect(actualProjects).deep.eq(
        expectedEntities.map((model) => ({ model, etag: 'foo-etag' })),
      );
    });
  });

  describe('replace', () => {
    it('should replace entity with given etag', async () => {
      helper.tableServiceAsPromisedMock.replaceEntity.resolves({
        ['.metadata']: { etag: 'next-etag' },
      });
      const expected: FooModel = {
        bar: 42,
        partitionId: 'partId',
        rowId: 'rowId',
      };
      const expectedResult: Result<FooModel> = {
        model: expected,
        etag: 'next-etag',
      };
      const result = await helper.sut.replace(expected, 'prev-etag');
      expect(result).deep.eq(expectedResult);
      const expectedEntity = createRawEntity(expected, 'prev-etag');
      expect(helper.tableServiceAsPromisedMock.replaceEntity).calledWith(
        FooModel.tableName,
        expectedEntity,
        {},
      );
    });

    it('should throw a OptimisticConcurrencyError if the UPDATE_CONDITION_NOT_SATISFIED is thrown', async () => {
      helper.tableServiceAsPromisedMock.replaceEntity.rejects(
        new StorageError(Constants.StorageErrorCodeStrings.UPDATE_CONDITION_NOT_SATISFIED),
      );
      await expect(
        helper.sut.replace({ bar: 24, partitionId: 'part', rowId: 'row' }, 'prev-etag'),
      ).rejectedWith(OptimisticConcurrencyError);
    });
  });

  describe('insert', () => {
    it('should insert entity', async () => {
      helper.tableServiceAsPromisedMock.insertEntity.resolves({
        ['.metadata']: { etag: 'next-etag' },
      });
      const expected: FooModel = {
        bar: 42,
        partitionId: 'partId',
        rowId: 'rowId',
      };
      const expectedResult: Result<FooModel> = {
        model: expected,
        etag: 'next-etag',
      };
      const result = await helper.sut.insert(expected);
      expect(result).deep.eq(expectedResult);
      expect(helper.tableServiceAsPromisedMock.insertEntity).calledWith(
        FooModel.tableName,
        createRawEntity(expected),
        {},
      );
    });

    it('should throw an OptimisticConcurrencyError if the entity already exists', async () => {
      helper.tableServiceAsPromisedMock.insertEntity.rejects(
        new StorageError(Constants.TableErrorCodeStrings.ENTITY_ALREADY_EXISTS),
      );
      await expect(helper.sut.insert({ bar: 24, partitionId: 'part', rowId: 'row' })).rejectedWith(
        OptimisticConcurrencyError,
      );
    });
  });

  function createRawEntity(overrides?: Partial<FooModel>, etag?: string) {
    const foo: FooModel = {
      bar: 42,
      partitionId: 'partKey',
      rowId: 'rowKey',
      ...overrides,
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
      PartitionKey: foo.partitionId,
      RowKey: foo.rowId,
      bar: foo.bar,
      ['.metadata']: metadata(),
    };
  }

  function createEntity(
    overrides?: Partial<FooModel>,
    etag = 'foo-etag',
  ): Entity<FooModel, 'partitionId' | 'rowId'> {
    const foo: FooModel = {
      bar: 42,
      partitionId: 'partKey',
      rowId: 'rowKey',
      ...overrides,
    };
    return {
      PartitionKey: { _: foo.partitionId, $: 'Edm.String' },
      RowKey: { _: foo.rowId, $: 'Edm.String' },
      bar: { _: foo.bar, $: 'Edm.Int32' },
      ['.metadata']: {
        etag,
      },
    };
  }
});
