import * as debug from 'debug';
import { NextFunction, Request, Response} from 'express';

const log = debug('Request log')

export const requestLog = (req: Request, res: Response, next: NextFunction) => {
    const { method, path, query } = req;
    const hasQueryString = Object.keys(query).length > 0;
    const queryString = hasQueryString
        ? '?' + Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')
        : '';
    const start = new Date().getTime();
    next();
    const end = new Date().getTime();
    const { statusCode } = res;
    const line = `${method} ${path}${queryString} -> ${statusCode} (${end - start} ms)`;
    log(line);
}