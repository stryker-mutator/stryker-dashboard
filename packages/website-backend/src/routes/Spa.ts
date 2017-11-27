import { NextFunction, Request, Response, Router } from 'express';
import * as debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';

export class SpaRoutes {

    constructor(private frontEndPath: string) { }

    static create(router: Router, frontEndPath: string) {
        const spaRoutes = new SpaRoutes(frontEndPath);
        router.get(
            '/api/repository',
            spaRoutes.spa());
        debug('SpaRoutes')('Routes created');
    }

    private spa() {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.url.startsWith('/api') || req.url.startsWith('/auth')) {
                next();
            } else {
                res.send(this.indexHtml);
            }
        }
    }

    private _indexHtml: string;
    get indexHtml(): string {
        if (!this._indexHtml) {
            this._indexHtml = fs.readFileSync(path.join(this.frontEndPath, 'index.html'), 'utf8');
        }
        return this._indexHtml;
    }

}