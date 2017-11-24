import * as debug from 'debug';
import { NextFunction, Request, Response, Router } from 'express';

export class UserRoutes {
    static create(router: Router) {
        const routes = new UserRoutes();
        router.get(
            '/api/user',
            routes.getUser);
        debug('UserRoutes')('Routes created');
    }

    public getUser(req: Request, res: Response, next: NextFunction) {
        const user = { ...req.user };
        const { displayName, username } = user;
        res.send({ displayName, username });
    }
}