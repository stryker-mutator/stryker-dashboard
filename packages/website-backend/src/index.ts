import * as debug from 'debug';

import app from './app';
import config from './configuration';

debug('app')('Starting Stryker Mutator Badge API')

const { port } = config();
const server = app.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
    const addr = server.address();
    debug(`Listening on port ${addr.port}`);
}
