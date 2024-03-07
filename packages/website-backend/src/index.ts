import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import passport from 'passport';
import Configuration from './services/Configuration.js';
import { githubStrategy } from './middleware/security.middleware.js';
import { INestApplication } from '@nestjs/common';
import DataAccess from './services/DataAccess.js';
import parser from 'body-parser';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  configureAzureStorage(app);
  configurePassport(app);

  app.use(parser.json({ limit: '100mb' }));
  app.use(compression());
  await app.listen(1337);
}

function configureAzureStorage(app: INestApplication) {
  const dataAccess = app.get<DataAccess>(DataAccess);

  dataAccess.blobService.createStorageIfNotExists();
  dataAccess.mutationTestingReportService.createStorageIfNotExists();
  dataAccess.repositoryMapper.createStorageIfNotExists();
}

function configurePassport(app: INestApplication) {
  const config = app.get<Configuration>(Configuration);

  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user as Express.User);
  });

  passport.use(githubStrategy(config));

  app.use(passport.initialize());
}

bootstrap();
