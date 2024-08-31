import { TableClient } from '@azure/data-tables';

export const createTableClient = (tableName: string) => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (connectionString) {
    return TableClient.fromConnectionString(connectionString, tableName, {
      allowInsecureConnection: process.env.NODE_ENV !== 'production',
    });
  } else {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
  }
};
