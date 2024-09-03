import { expect } from 'chai';
import { createTableClient } from '../../../src/services/TableClient.js';
import { TableClient } from '@azure/data-tables';

describe(createTableClient.name, () => {
  let originalEnv: string | undefined;
  beforeEach(() => {
    originalEnv = process.env.AZURE_STORAGE_CONNECTION_STRING;
    process.env.AZURE_STORAGE_CONNECTION_STRING =
      'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1';
  });
  afterEach(() => {
    process.env.AZURE_STORAGE_CONNECTION_STRING = originalEnv;
  });

  it('should return a TableClient', () => {
    const actual = createTableClient('tableName');
    expect(actual).to.be.instanceOf(TableClient);
    expect(actual.tableName).to.eq('tableName');
  });

  it('should throw an error when AZURE_STORAGE_CONNECTION_STRING is not set', () => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;
    expect(() => createTableClient('tableName')).to.throw('AZURE_STORAGE_CONNECTION_STRING is not set');
  });
});
