import * as debug from 'debug';
import Server from './Server';
import { optionalEnvVar } from './utils';

const log = debug('app');
log('Starting Stryker Mutator dashboard');

const port = parseInt(optionalEnvVar('PORT', '1337'), 10);
const server = new Server(port);
server.start()
  .then(onListening)
  .catch(onError);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      log(`Port ${port}requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log(`Port ${port}is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.httpServer.address();
  debug(`Listening on port ${printPort()}`);

  function printPort() {
    if (typeof addr === 'string') {
      return addr;
    } else {
      return addr.port;
    }
  }
}
