import { expect } from 'chai';
import { createBlobServiceClient } from '../../../src/services/BlobServiceClient.js';
import { BlobServiceClient } from '@azure/storage-blob';

describe(createBlobServiceClient.name, () => {
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
    const actual = createBlobServiceClient();
    expect(actual).to.be.instanceOf(BlobServiceClient);
  });

  it('should throw an error when AZURE_STORAGE_CONNECTION_STRING is not set', () => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;
    expect(() => createBlobServiceClient()).to.throw('AZURE_STORAGE_CONNECTION_STRING is not set');
  });
});
