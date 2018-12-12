import { ServerLoader, ServerSettings } from '@tsed/common';
import * as path from 'path';
import * as passport from 'passport';
import * as express from 'express';
import cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';
import { githubStrategy, securityMiddleware } from './middleware/securityMiddleware';
import { spa } from './middleware/spaMiddleware';
import errorHandler from './middleware/errorHandler';

@ServerSettings({
    acceptMimes: ['application/json'],
    mount: {
        '/api': '${rootDir}/api/**/**.js',
        '/auth': '${rootDir}/auth/**/**.js'
    },
    rootDir: __dirname
})
export default class Server extends ServerLoader {
    private frontEndPath = path.join(__dirname, /*src*/ '..', /*dist*/ '..', 'node_modules', 'stryker-dashboard-website-frontend', 'dist');

    constructor(port: number) {
        super();
        this.settings.port = port;
    }

    $onMountingMiddlewares() {
        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser((user, done) => {
            return done(null, user);
        });
        passport.use(githubStrategy());

        this
            .use(express.static(this.frontEndPath))
            .use(spa(this.frontEndPath))
            .use(bodyParser.json())
            .use(cookieParser())
            .use(securityMiddleware())
            .use(passport.initialize())
            .use(passport.session())
            .use(errorHandler);
    }
}