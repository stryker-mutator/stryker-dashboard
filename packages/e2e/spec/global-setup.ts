import { TableClient } from '@azure/data-tables';
import { BlobServiceClient } from '@azure/storage-blob';

function getConnectionString(): string {
  if (process.env.E2E_AZURE_STORAGE_CONNECTION_STRING) {
    return process.env.E2E_AZURE_STORAGE_CONNECTION_STRING;
  } else {
    throw new Error('Please configure the "E2E_AZURE_STORAGE_CONNECTION_STRING" env variable');
  }
}

const blobService = BlobServiceClient.fromConnectionString(getConnectionString());

async function deleteAllEntities(tableName: string) {
  const tableClient = TableClient.fromConnectionString(getConnectionString(), tableName, {
    allowInsecureConnection: true,
  });

  await tableClient.createTable();

  for await (const entity of tableClient.listEntities()) {
    await tableClient.deleteEntity(entity.partitionKey!, entity.rowKey!);
  }
}

async function deleteAllBlobs(containerName: string) {
  const containerClient = blobService.getContainerClient(containerName);

  await containerClient.createIfNotExists();

  for await (const blob of containerClient.listBlobsFlat()) {
    await containerClient.getBlobClient(blob.name).deleteIfExists();
  }
}

export default async function globalSetup() {
  await Promise.all([
    deleteAllEntities('MutationTestingReport'),
    deleteAllEntities('Project'),
    deleteAllBlobs('mutation-testing-report'),
  ]);
}
