import { createProjectMapper, Project, DashboardQuery } from '../../src/index.js';
import { expect } from 'chai';
import { Mapper } from '../../src/index.js';
import { TableClient, TableServiceClient } from '@azure/data-tables';
import { createTableClient } from '../../src/services/TableClient.js';

/**
 * Enable the azure storage emulator on your local computer before running these tests
 */
describe('Data access layer', () => {
  let tableClient: TableClient;
  let tableServiceClient: TableServiceClient;

  beforeEach(() => {
    tableClient = createTableClient('Project');
    tableServiceClient = TableServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!, {
      allowInsecureConnection: true,
    });
  });

  describe('ProjectMapper', () => {
    let sut: Mapper<Project, 'owner', 'name'>;
    beforeEach(async () => {
      sut = createProjectMapper();
      await tableClient.deleteTable();
      await sut.createStorageIfNotExists();
    });

    it('should create the Project table', async () => {
      await tableClient.deleteTable();
      await sut.createStorageIfNotExists();
      const result = tableServiceClient.listTables();
      const tables: string[] = [];
      for await (const table of result) {
        tables.push(table.name!);
      }
      expect(tables).includes('Project');
    });

    it('should insert a project', async () => {
      const key = Object.freeze({ partitionKey: 'partKey', rowKey: 'rowKey' });
      await sut.insertOrMerge({
        name: 'rowKey',
        owner: 'partKey',
        enabled: true,
        apiKeyHash: 'someApiHash',
      });
      const actual = await tableClient.getEntity(key.partitionKey, key.rowKey);
      expect(actual).deep.include({
        partitionKey: 'partKey',
        rowKey: 'rowKey',
        enabled: true,
        apiKeyHash: 'someApiHash',
      });
    });

    it('should query retrieve a single entity on query', async () => {
      const key = Object.freeze({ partitionKey: 'partKey', rowKey: 'rowKey' });
      await tableClient.createEntity({ ...key, enabled: true });
      const actual = await sut.findOne({ name: 'rowKey', owner: 'partKey' });
      expect(actual?.model).deep.eq({
        apiKeyHash: undefined,
        owner: 'partKey',
        name: 'rowKey',
        enabled: true,
      });
    });

    it('should retrieve multiple entities with a single partition key', async () => {
      const key = Object.freeze({ partitionKey: 'stryker-mutator' });
      await tableClient.createEntity({ ...key, enabled: true, rowKey: 'stryker' });
      await tableClient.createEntity({ ...key, enabled: false, rowKey: 'stryker-dashboard' });
      const actual = await sut.findAll(
        DashboardQuery.create(Project).wherePartitionKeyEquals({
          owner: key.partitionKey,
        }),
      );

      expect(actual.map((a) => a.model)).deep.eq([
        { apiKeyHash: undefined, owner: 'stryker-mutator', name: 'stryker', enabled: true },
        {
          apiKeyHash: undefined,
          owner: 'stryker-mutator',
          name: 'stryker-dashboard',
          enabled: false,
        },
      ]);
    });
  });
});
