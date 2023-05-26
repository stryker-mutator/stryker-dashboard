import debug from 'debug';
import Server from './Server.js';
import { PlatformExpress } from '@tsed/platform-express';
import util from './utils.js';
import {
  createProjectMapper,
  MutationTestingReportService,
  RealTimeMutantsBlobService,
} from '@stryker-mutator/dashboard-data-access';

const log = debug('app');
log('Starting Stryker Mutator dashboard');
const port = parseInt(util.optionalEnvVar('PORT', '1337'), 10);

async function ensureDatabaseExists() {
  const repositoryMapper = createProjectMapper();
  const realTimeMutantsBatchingService = new RealTimeMutantsBlobService();
  const mutationTestingReportService = new MutationTestingReportService();

  await repositoryMapper.createStorageIfNotExists();
  await realTimeMutantsBatchingService.createStorageIfNotExists();
  await mutationTestingReportService.createStorageIfNotExists();
}

async function startServer() {
  const platform = await PlatformExpress.bootstrap(Server, { port });
  await platform.listen();
  debug(`Listening on port ${port}`);
}

async function run() {
  try {
    await ensureDatabaseExists();
    await startServer();
  } catch (error) {
    if (isErrnoError(error)) {
      if (error.syscall !== 'listen') {
        throw error;
      }
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${port} requires elevated privileges`);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${port} is already in use`);
          break;
        default:
          console.error(`Unknown Error: `, error);
      }
    } else {
      console.error(`Unknown Error: `, error);
    }
    process.exit(1);
  }
}
run();

function isErrnoError(error: any): error is NodeJS.ErrnoException {
  return typeof (error as NodeJS.ErrnoException).code === 'string';
}
