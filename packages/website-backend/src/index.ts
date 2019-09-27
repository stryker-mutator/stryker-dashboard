import debug from 'debug';
import Server from './Server';
import { optionalEnvVar } from './utils';
import { createProjectMapper, createMutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';

const log = debug('app');
log('Starting Stryker Mutator dashboard');
const port = parseInt(optionalEnvVar('PORT', '1337'), 10);

async function ensureDatabaseExists() {
  const repositoryMapper = createProjectMapper();
  const mutationTestingReportMapper = createMutationTestingReportMapper();

  await repositoryMapper.createStorageIfNotExists();
  await mutationTestingReportMapper.createStorageIfNotExists();
}

async function startServer() {
  const server = new Server(port);
  await server.start();
  debug(`Listening on port ${getPort()}`);

  function getPort() {
    const addr = server.httpServer.address();
    if (typeof addr === 'string') {
      return addr;
    } else if (addr) {
      return addr.port;
    } else {
      return 'unknown';
    }
  }
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
