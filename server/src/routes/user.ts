import * as debug from 'debug';
import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';

export class UserRoutes {
    static create(router: Router) {
        const routes = new UserRoutes();
        router.get(
            '/api/user',
            passport.authenticate('github'),
            routes.getUser);
        debug('GitHubRoutes')('Routes created');
    }

    public getUser(req: Request, res: Response, next: NextFunction) {
        const user = { ...req.user };
        delete user.accessToken;
        res.send(user);
    }
}