import * as debug from 'debug';
import Server from './Server';
import { optionalEnvVar } from './utils';

debug('app')('Starting Stryker Mutator dashboard')

const port = parseInt(optionalEnvVar('PORT', '1337'), 10);
const server = new Server(port);
server.start()
    .then(onListening)
    .catch(onError);

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    switch(error.code) {
        case 'EACCES':
            console.error(`Port ${port}requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port}is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
  
function onListening(): void {
    const addr = server.httpServer.address();
    debug(`Listening on port ${addr.port}`);
}
