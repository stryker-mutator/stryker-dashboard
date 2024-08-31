import { BlobServiceClient } from '@azure/storage-blob';

export const createBlobServiceClient = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (connectionString) {
    return BlobServiceClient.fromConnectionString(connectionString);
  } else {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  }
};
