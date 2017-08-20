import * as debug from 'debug';
import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';

import config from '../configuration';
import { createToken } from '../security';

export class GitHubRoutes {
    static create(router: Router) {
        const routes = new GitHubRoutes();
        router.get(
            '/auth/github',
            passport.authenticate('github', { scope: ['user:email'] })
        );
        router.get(
            '/auth/github/callback',
            passport.authenticate('github'),
            routes.callback
        );
        router.get('/logout', routes.logout);
        debug('GitHubRoutes')('Routes created');
    }

    public callback(req: Request, res: Response, next: NextFunction) {
        createToken(req.user).then(token => {
            debug('GitHubRoutes')(`Generated JWT for user ${req.user.username}`);
            res.cookie('jwt', token, {
                httpOnly: true,
                sameSite: true,
                secure: !config.isDevelopment
            });
            res.redirect('/');
        });
    }

    public logout(req: Request, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/');
    }
}