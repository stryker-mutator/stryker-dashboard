import * as debug from 'debug';
import * as http from 'http';

import App from './app';

debug('app')('Booting Stryker Mutator Badge API')

const port = normalizePort(process.env.PORT || 3000);
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(value: number|string) {
    const port: number = (typeof value === 'string') ? parseInt(value, 10) : value;
    if (isNaN(port)) return value;
    else if (port >= 0) return port;
    else return false;  
};

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
  
function onListening(): void {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
