import {
  createProjectMapper,
  Project,
  DashboardQuery,
} from '../../src/index.js';
import azure, { TableService } from 'azure-storage';
import { promisify } from 'util';
import { expect } from 'chai';
import { Mapper } from '../../src/index.js';

/**
 * Enable the azure storage emulator on your local computer before running these tests
 */
describe('Data access layer', () => {
  let tableService: TableService;

  beforeEach(async () => {
    tableService = azure.createTableService();
  });

  describe('ProjectMapper', () => {
    let sut: Mapper<Project, 'owner', 'name'>;
    beforeEach(async () => {
      sut = createProjectMapper();
      await promisify(tableService.deleteTableIfExists).apply(tableService, [
        'Project',
      ]);
      await sut.createStorageIfNotExists();
    });

    it('should create the Project table', async () => {
      await promisify(tableService.deleteTableIfExists).apply(tableService, [
        'Project',
      ]);
      await sut.createStorageIfNotExists();
      const result: TableService.TableResult = await promisify(
        tableService.doesTableExist
      ).apply(tableService, ['Project']);
      expect(result.exists).eq(true);
    });

    it('should insert a project', async () => {
      const key = Object.freeze({ PartitionKey: 'partKey', RowKey: 'rowKey' });
      await sut.insertOrMerge({
        name: 'rowKey',
        owner: 'partKey',
        enabled: true,
        apiKeyHash: 'someApiHash',
      });
      const actual = await promisify(tableService.retrieveEntity).apply(
        tableService,
        ['Project', key.PartitionKey, key.RowKey]
      );
      expect(actual).deep.include({
        PartitionKey: { $: 'Edm.String', _: 'partKey' },
        RowKey: { $: 'Edm.String', _: 'rowKey' },
        enabled: { _: true },
        apiKeyHash: { _: 'someApiHash' },
      });
    });

    it('should query retrieve a single entity on query', async () => {
      const key = Object.freeze({ PartitionKey: 'partKey', RowKey: 'rowKey' });
      await promisify(tableService.insertOrReplaceEntity).apply(tableService, [
        'Project',
        { ...key, enabled: true },
      ]);
      const actual = await sut.findOne({ name: 'rowKey', owner: 'partKey' });
      expect(actual).deep.eq({
        owner: 'partKey',
        name: 'rowKey',
        enabled: true,
      });
    });

    it('should retrieve multiple entities with a single partition key', async () => {
      const key = Object.freeze({ PartitionKey: 'stryker-mutator' });
      await promisify(tableService.insertOrReplaceEntity).apply(tableService, [
        'Project',
        { ...key, enabled: true, RowKey: 'stryker' },
      ]);
      await promisify(tableService.insertOrReplaceEntity).apply(tableService, [
        'Project',
        { ...key, enabled: false, RowKey: 'stryker-dashboard' },
      ]);
      const actual = await sut.findAll(
        DashboardQuery.create(Project).wherePartitionKeyEquals({
          owner: key.PartitionKey,
        })
      );
      expect(actual).deep.eq([
        { owner: 'stryker-mutator', name: 'stryker', enabled: true },
        { owner: 'stryker-mutator', name: 'stryker-dashboard', enabled: false },
      ]);
    });
  });
});
