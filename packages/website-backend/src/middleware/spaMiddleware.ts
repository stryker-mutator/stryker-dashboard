import * as fs from 'fs';
import * as path from 'path';
import { NextFunction, Response, Request } from "express";


const blacklist = ['/api', '/auth'];

export function spa(frontEndPath: string) {
    const indexHtml = fs.readFileSync(path.join(frontEndPath, 'index.html'), 'utf8');
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET' ||
            blacklist.some(item => req.url.startsWith(item)) ||
            req.url.indexOf('.') >= 0) {
            next();
        } else {
            res.send(indexHtml);
        }
    }
}