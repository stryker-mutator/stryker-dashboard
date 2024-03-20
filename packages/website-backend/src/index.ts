import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import passport from 'passport';
import Configuration from './services/Configuration.js';
import { githubStrategy } from './middleware/security.middleware.js';
import { INestApplication } from '@nestjs/common';
import DataAccess from './services/DataAccess.js';
import compression from 'compression';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('/api');

  configureSecurityHeaders(app);
  configureAzureStorage(app);
  configurePassport(app);

  app.useBodyParser('json', { limit: '100mb' });
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

function configureSecurityHeaders(app: INestApplication) {
  app.enableCors({ origin: true, credentials: true });
  app.use(
    helmet({
      strictTransportSecurity: {
        maxAge: 31536000,
        preload: true,
      },
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'https://stryker-mutator.io',
            'https://avatars.githubusercontent.com',
            'https://img.shields.io',
          ],
          scriptSrcAttr: [`'unsafe-inline'`],
        },
      },
    }),
  );
}

bootstrap();
