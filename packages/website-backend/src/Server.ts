import path from 'path';
import {
  BeforeInit,
  Configuration,
  Inject,
  PlatformApplication,
} from '@tsed/common';
import passport from 'passport';
import express from 'express';
import bodyParser from 'body-parser';
import { githubStrategy } from './middleware/securityMiddleware.js';
import { spa } from './middleware/spaMiddleware.js';
import { dist } from '@stryker-mutator/dashboard-frontend';
import { fileURLToPath } from 'url';
import ConfigurationService from './services/Configuration.js';
import DataAccess from './services/DataAccess.js';

@Configuration({
  mount: {
    '/api': ['${rootDir}/api/**/**.js'],
  },
  rootDir: fileURLToPath(new URL('.', import.meta.url)),
})
export default class Server implements BeforeInit {
  @Inject()
  app: PlatformApplication;

  @Inject()
  dataAccess: DataAccess;

  public $beforeRoutesInit() {
    passport.serializeUser((user, done) => {
      return done(null, user);
    });
    passport.deserializeUser((user, done) => {
      return done(null, user as Express.User);
    });
    passport.use(
      githubStrategy(
        this.app.injector.get<ConfigurationService>(ConfigurationService)!
      )
    );
    this.app
      .use(express.static(dist))
      .use(spa(path.join(dist, 'index.html')))
      .use(bodyParser.json({ limit: '100mb' }))
      .use(passport.initialize());
  }

  $beforeInit(): void | Promise<any> {
    this.dataAccess.blobService.createStorageIfNotExists();
    this.dataAccess.mutationTestingReportService.createStorageIfNotExists();
    this.dataAccess.repositoryMapper.createStorageIfNotExists();
  }
}
