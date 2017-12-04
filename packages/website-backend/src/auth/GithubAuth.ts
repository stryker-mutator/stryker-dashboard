import { Controller, Get, Use } from 'ts-express-decorators';
import * as passport from 'passport';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { createToken, passportAuthenticateGithub } from '../middleware/securityMiddleware';
import * as utils from '../utils'
import Configuration from '../services/Configuration';

@Controller('/github')
export default class GithubAuth {

    private readonly log = utils.debug(GithubAuth.name);

    constructor(private config: Configuration) {
    }

    @Get('/')
    get(request: express.Request, response: express.Response, next: express.NextFunction): void {
        passport.authenticate('github', { scope: ['user:email', 'read:org'] })(request, response, next);
    }

    @Get('/callback')
    @Use(passportAuthenticateGithub)
    callback(req: Request, res: Response, next: NextFunction) {
        createToken(req.user, this.config.jwtSecret).then(token => {
            this.log(`Generated JWT for user ${req.user.username}`);
            res.cookie('jwt', token, {
                httpOnly: true,
                sameSite: true,
                secure: !this.config.isDevelopment
            });
            res.redirect('/');
        });
    }

    @Get('/logout')
    logout(req: Request, res: Response, next: NextFunction) {
        const cookies = req.cookies || {};
        for (let cookie in cookies) {
            if (!cookies.hasOwnProperty(cookie)) {
                continue;
            }
            res.cookie(cookie, '', { expires: new Date(0) });
        }
        req.logout();
        res.redirect('/');
    }
}