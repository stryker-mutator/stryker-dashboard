import TableStorageMapper from '../../../src/mappers/TableStorageMapper';
import TableServiceAsPromised, { Entity, EntityKey } from '../../../src/storage/TableServiceAsPromised';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { TableQuery } from 'azure-storage';

describe(TableStorageMapper.name, () => {

  class FooEntity {
    public partitionId: string;
    public rowId: string;
    public bar: number;

    public static createPartitionKey(entity: Pick<FooEntity, 'partitionId'>): string {
      return entity.partitionId;
    }
    public static createRowKey(entity: Pick<FooEntity, 'rowId'>): string | undefined {
      return entity.rowId;
    }
    public static identify(entity: FooEntity, partitionKeyValue: string, rowKeyValue: string): void {
      entity.partitionId = partitionKeyValue;
      entity.rowId = rowKeyValue;
    }
    public static readonly persistedFields: readonly (keyof FooEntity)[] = ['bar'];
    public static readonly tableName = 'FooTable';
  }

  class TestHelper {
    public tableServiceAsPromisedMock: sinon.SinonStubbedInstance<TableServiceAsPromised> = {
      createTableIfNotExists: sinon.stub(),
      insertOrMergeEntity: sinon.stub(),
      queryEntities: sinon.stub()
    };
    public sut = new TableStorageMapper(FooEntity, this.tableServiceAsPromisedMock as any);
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

  describe('insertOrMergeEntity', () => {
    it('should insert the given entity', async () => {
      const expected: FooEntity = {
        partitionId: 'github/owner',
        rowId: 'name',
        bar: 42
      };
      helper.tableServiceAsPromisedMock.insertOrMergeEntity.resolves();
      await helper.sut.insertOrMergeEntity(expected);
      expect(helper.tableServiceAsPromisedMock.insertOrMergeEntity).calledWith('FooTable', {
        PartitionKey: 'github;owner',
        RowKey: 'name',
        bar: 42
      });
      expect(expected.bar).eq(42);
    });
  });

  describe('findOne', () => {
    it('should query the underlying storage', async () => {
      const expectedQuery = new TableQuery()
        .where('PartitionKey eq ?', 'github;partKey')
        .and('RowKey eq ?', 'rowKey');
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: [] });
      await helper.sut.findOne({ partitionId: 'github/partKey', rowId: 'rowKey' });
      expect(helper.tableServiceAsPromisedMock.queryEntities).calledWith('FooTable', expectedQuery);
    });

    it('should return null if the result was empty', async () => {
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: [] });
      const actualProjects = await helper.sut.findOne({ partitionId: 'github/partKey', rowId: 'rowKey' });
      expect(actualProjects).null;
    });

    it('should return the first entity when select is called with a row key', async () => {
      const results: (Entity<Pick<FooEntity, 'bar'>> & EntityKey)[] = [{
        PartitionKey: { _: 'partKey', $: 'Edm.String' },
        RowKey: { _: 'rowKey', $: 'Edm.String' },
        bar: { _: 42, $: 'Edm.Int32' }
      }];
      const expected: FooEntity = { rowId: 'rowKey', partitionId: 'partKey', bar: 42 };
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: results });
      const actualProjects = await helper.sut.findOne({ partitionId: 'github/partKey', rowId: 'rowKey' });
      expect(actualProjects).deep.eq(expected);
    });
  });

  describe('findAll', () => {
    it('should query the underlying storage', async () => {
      const expectedQuery = new TableQuery().where('PartitionKey eq ?', 'github;partKey');
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: [] });
      await helper.sut.findAll( { partitionId: 'github/partKey' });
      expect(helper.tableServiceAsPromisedMock.queryEntities).calledWith('FooTable', expectedQuery);
    });

    it('should return the all entities', async () => {
      const results: (Entity<Pick<FooEntity, 'bar'>> & EntityKey)[] = [{
        PartitionKey: { _: 'partKey', $: 'Edm.String' },
        RowKey: { _: 'rowKey', $: 'Edm.String' },
        bar: { _: 142, $: 'Edm.Int32' }
      }, {
        PartitionKey: { _: 'partKey2', $: 'Edm.String' },
        RowKey: { _: 'rowKey2', $: 'Edm.String' },
        bar: { _: 25, $: 'Edm.Int32' }
      }];
      const expected: FooEntity[] = [
        { rowId: 'rowKey', partitionId: 'partKey', bar: 142 },
        { rowId: 'rowKey2', partitionId: 'partKey2', bar: 25 }
      ];
      helper.tableServiceAsPromisedMock.queryEntities.resolves({ entries: results });
      const actualProjects = await helper.sut.findAll( { partitionId: 'github/partKey' });
      expect(actualProjects).deep.eq(expected);
    });
  });

});
