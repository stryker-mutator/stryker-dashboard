import {
  createBlobService,
  createTableService,
  TableService,
  TableQuery,
  common,
  BlobService,
} from "azure-storage";
import { promisify } from "util";

function getConnectionString(): string {
  if (process.env.E2E_AZURE_STORAGE_CONNECTION_STRING) {
    return process.env.E2E_AZURE_STORAGE_CONNECTION_STRING;
  } else {
    throw new Error(
      'Please configure the "E2E_AZURE_STORAGE_CONNECTION_STRING" env variable'
    );
  }
}

const blobService = createBlobService(getConnectionString());
const tableService = createTableService(getConnectionString());
const listBlobsSegmented = promisify(blobService.listBlobsSegmented).bind(
  blobService
);
const deleteBlobIfExists = promisify(blobService.deleteBlobIfExists).bind(
  blobService
);
const deleteEntity = promisify(tableService.deleteEntity).bind(tableService);
const queryEntities = promisify(tableService.queryEntities).bind(tableService);

// TypeScript types don't support strict null checks
const firstToken = null as unknown as TableService.TableContinuationToken &
  common.ContinuationToken;

async function deleteAllEntities(tableName: string) {
  let waitThereIsMore = true;
  while (waitThereIsMore) {
    const result = await queryEntities(tableName, new TableQuery(), firstToken);
    await Promise.all(
      result.entries.map((entity) => deleteEntity(tableName, entity))
    );
    waitThereIsMore = !!result.continuationToken;
  }
}

async function deleteAllBlobs(containerName: string) {
  let waitThereIsMore = true;
  while (waitThereIsMore) {
    const result = (await listBlobsSegmented(
      containerName,
      firstToken
    )) as BlobService.ListBlobsResult;
    await Promise.all(
      result.entries.map((entry) =>
        deleteBlobIfExists(containerName, entry.name)
      )
    );
    waitThereIsMore = !!result.continuationToken;
  }
}

export default async function globalSetup() {
  await Promise.all([
    deleteAllEntities("MutationTestingReport"),
    deleteAllEntities("Project"),
    deleteAllBlobs("mutation-testing-report"),
  ]);
}
