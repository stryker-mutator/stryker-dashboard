import debug = require('debug');
import { Request, Response, NextFunction } from 'express';

export class RequestLog {

    constructor(private log: debug.IDebugger = debug('RequestLog')) {
    }

    public middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { method, path, query } = req;
            const hasQueryString = Object.keys(query).length > 0;
            const queryString = hasQueryString
                ? '?' + Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')
                : '';
            const start = new Date().getTime();
            next();
            const end = new Date().getTime();
            const { statusCode } = res;
            const line = `${method} ${path}${queryString} : ${statusCode} [${end - start} ms]`;
            this.log(line);
        }
    }
}
