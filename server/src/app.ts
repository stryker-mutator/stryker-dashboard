import * as bodyParser from 'body-parser';
import cookieParser = require('cookie-parser');
import * as express from 'express';
import * as passport from 'passport';

import errorHandler from './errorHandler';
import { middleware, githubStrategy } from './security';
import { requestLog } from './utils';
import { GitHubRoutes } from './routes/github';
import { UserRoutes } from './routes/user';
import { RepositoryRoutes } from './routes/repository';

class App {
    public express: express.Application;

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
        this.express.use(requestLog);
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(middleware());
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

        return router;
    }

}

export default new App().express;
