import * as debug from 'debug';
import { NextFunction, Request, Response, Router } from 'express';

import { retrieveRepositories } from '../github';

export class RepositoryRoutes {
    static create(router: Router) {
        router.get(
            '/api/repository',
            this.spa);
        debug('RepositoryRoutes')('Routes created');
    }

    static spa(req: Request, res: Response, next: NextFunction) {
        retrieveRepositories(req.user)
            .then(repos => {
                debug('RepositoryRoutes')(repos);
                res.send(repos);
            })
            .catch(error => {
                debug('RepositoryRoutes')('Error!: ' + error);
                res.statusCode = 500;
                res.send(error);
                res.end();
            });
    }
}