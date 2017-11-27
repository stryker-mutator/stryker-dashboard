import * as bodyParser from 'body-parser';
import cookieParser = require('cookie-parser');
import * as express from 'express';
import * as passport from 'passport';
import * as path from 'path';

import errorHandler from './errorHandler';
import { securityMiddleware, githubStrategy } from './security';
import { GitHubRoutes } from './routes/github';
import { UserRoutes } from './routes/user';
import { RepositoryRoutes } from './routes/repository';
import { RequestLog } from './RequestLog';
import * as debug from 'debug';
import { SpaRoutes } from './routes/Spa';

class App {
    public express: express.Application;
    private frontEndPath = path.join(__dirname, /*src*/ '..', /*dist*/ '..', 'node_modules', 'stryker-badge-website-frontend', 'dist');

    constructor() {
        this.express = express();
        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser((user, done) => {
            return done(null, user);
        });
        passport.use(githubStrategy());
        this.middleware();
        this.express.use('/', this.routes());
    }

    // Configure Express middleware.
    private middleware() {
        debug('app')(`Serving static files from ${this.frontEndPath}`);
        this.express.use(new RequestLog().middleware());
        this.express.use(express.static(this.frontEndPath));
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(securityMiddleware());
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(errorHandler);
    }

    // Configure API endpoints.
    private routes() {
        const router = express.Router();

        GitHubRoutes.create(router);
        UserRoutes.create(router);
        RepositoryRoutes.create(router);
        SpaRoutes.create(router, this.frontEndPath);
        return router;
    }

}

export default new App().express;
