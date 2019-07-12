import ProjectMapper from '../../src/ProjectMapper';
import azure = require('azure-storage');
import { TableService } from 'azure-storage';
import { promisify } from 'util';
import { expect } from 'chai';

/**
 * Enable the azure storage emulator on your local computer before running these tests
 */
describe('Data access layer', () => {

  let tableService: TableService;

  beforeEach(async () => {
    tableService = azure.createTableService();
  });

  describe('ProjectMapper', () => {

    let sut: ProjectMapper;
    beforeEach(async () => {
      sut = new ProjectMapper();
      await promisify(tableService.deleteTableIfExists).apply(tableService, ['Project']);
      await sut.createTableIfNotExists();
    });

    it('should create the Project table', async () => {
      await promisify(tableService.deleteTableIfExists).apply(tableService, ['Project']);
      await sut.createTableIfNotExists();
      const result: TableService.TableResult = await promisify(tableService.doesTableExist).apply(tableService, ['Project']);
      expect(result.exists).eq(true);
    });

    it('should insert a project', async () => {
      const key = Object.freeze({ PartitionKey: 'partKey', RowKey: 'rowKey' });
      await sut.insertOrMergeEntity({ name: 'rowKey', owner: 'partKey', enabled: true, apiKeyHash: 'someApiHash' });
      const actual = await promisify(tableService.retrieveEntity).apply(tableService, ['Project', key.PartitionKey, key.RowKey]);
      expect(actual).deep.include({
        PartitionKey: { $: 'Edm.String', _: 'partKey' },
        RowKey: { $: 'Edm.String', _: 'rowKey' },
        enabled: { _: true },
        apiKeyHash: { _: 'someApiHash' }
      });
    });

    it('should query retrieve a single entity on query', async () => {
      const key = Object.freeze({ PartitionKey: 'partKey', RowKey: 'rowKey' });
      await promisify(tableService.insertOrReplaceEntity).apply(tableService, ['Project', { ...key, foo: 'bar' }]);
      const actual = await sut.select('partKey', 'rowKey');
      expect(actual).deep.eq({ owner: 'partKey', name: 'rowKey', foo: 'bar' });
    });

    it('should retrieve multiple entities with a single partition key', async () => {
      const key = Object.freeze({ PartitionKey: 'stryker-mutator' });
      await promisify(tableService.insertOrReplaceEntity).apply(tableService,
        ['Project', { ...key, enabled: true, RowKey: 'stryker' }]);
      await promisify(tableService.insertOrReplaceEntity).apply(tableService,
        ['Project', { ...key, enabled: false, RowKey: 'stryker-dashboard' }]);
      const actual = await sut.select(key.PartitionKey);
      expect(actual).deep.eq([
        { owner: 'stryker-mutator', name: 'stryker', enabled: true },
        { owner: 'stryker-mutator', name: 'stryker-dashboard', enabled: false }
      ]);
    });
  });
});
