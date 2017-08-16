import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import * as pg from 'pg';

const pgSession = require('connect-pg-simple')(session);

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
        passport.use(this.github());
        this.middleware();
        this.express.use('/', this.routes());
    }

    // Configure Express middleware.
    private middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(this.session());
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }

    // Configure Passport to authenticate using GitHub.
    private github() {
        const options = {
            callbackURL: '/auth/github/callback',
            clientID: process.env['GH_BASIC_CLIENT_ID'] || '',
            clientSecret: process.env['GH_BASIC_SECRET_ID'] || '',
        };
        const callback = (accessToken: string, refreshToken: string, profile: passport.Profile, done: Function) => {
            debug('auth')('Processing incoming OAuth 2 tokens');
            const user = {
                displayName: profile.displayName,
                id: profile.id,
                username: profile.username,
            };
            // TODO store the accessToken (encrypted) in the `users` table.
            return done(null, user);
        };
        return new GitHubStrategy(options, callback);
    }

    // Configure Connect middleware to persist session in the database.
    private session() {
        const isDevelopment = 'development' === process.env['NODE_ENV'];
        const config = {
            cookie: {
                secure: !isDevelopment,
            },
            resave: false,
            saveUninitialized: true,
            secret: process.env['SECRET'] || '',
            store: new pgSession({ pool: new pg.Pool(), tableName: 'sessions' })
        };
        return session(config);
    }

    // Configure API endpoints.
    private routes() {
        const router = express.Router();

        router.get('/auth/github',
                   passport.authenticate('github', { scope: ['user:email'] })
        );
        router.get('/auth/github/callback',
                   passport.authenticate('github', { failureRedirect: '/failure', successRedirect: '/' })
        );
        router.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });

        // placeholder route handler
        router.get('/', (req, res, next) => {
            const { user } = req;
            res.json({ message: 'Hello World!', user });
        });

        return router;
    }

}

export default new App().express;
