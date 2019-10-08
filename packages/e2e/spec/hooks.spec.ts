import { createBlobService, createTableService } from 'azure-storage';
import { promisify } from 'util';


function getConnectionString(): string {
  if(process.env.E2E_AZURE_STORAGE_CONNECTION_STRING){
    return process.env.E2E_AZURE_STORAGE_CONNECTION_STRING;
  }else {
    throw new Error('Please configure the "E2E_AZURE_STORAGE_CONNECTION_STRING" env variable');
  }
}

const blobService = createBlobService(getConnectionString());
const tableService = createTableService(getConnectionString());
const createContainer = promisify(blobService.createContainer).bind(blobService);
const deleteContainerIfExists = promisify(blobService.deleteContainerIfExists).bind(blobService);
const createTable = promisify(tableService.createTable).bind(tableService);
const deleteTableIfExists = promisify(tableService.deleteTableIfExists).bind(tableService);

function sleep() {
  return new Promise(res => setTimeout(res, 3000));
}

before(async () => {
  const promises = ['MutationTestingReport', 'Project'].map(async table => {
    await deleteTableIfExists(table);
    await sleep();
    await createTable(table);
  });
  promises.push(Promise.resolve().then(async () => {
    await deleteContainerIfExists('mutation-testing-report');
    await sleep();
    await createContainer('mutation-testing-report');
  }));
  await Promise.all(promises);
});
