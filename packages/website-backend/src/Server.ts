import { ServerLoader, ServerSettings } from '@tsed/common';
import passport from 'passport'; import express from 'express';
import * as bodyParser from 'body-parser';
import { githubStrategy } from './middleware/securityMiddleware';
import { spa } from './middleware/spaMiddleware';
import errorHandler from './middleware/errorHandler';
import { dist } from '@stryker-mutator/dashboard-frontend';

@ServerSettings({
  acceptMimes: ['application/json'],
  mount: {
    '/api': '${rootDir}/api/**/**.js'
  },
  rootDir: __dirname
})
export default class Server extends ServerLoader {

  constructor(port: number) {
    super();
    this.settings.port = port;
  }

  public $beforeRoutesInit() {
    passport.serializeUser((user, done) => {
      return done(null, user);
    });
    passport.deserializeUser((user, done) => {
      return done(null, user);
    });
    passport.use(githubStrategy());

    this
      .use(express.static(dist))
      .use(spa(dist))
      .use(bodyParser.json({ limit: '100mb' }))
      .use(passport.initialize())
      .use(passport.session())
      .use(errorHandler);
  }
}
