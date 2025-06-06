import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module.js';
import { AppInsightsLogger } from './logger.js';
import DataAccess from './services/DataAccess.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new AppInsightsLogger('NestApplication'),
  });
  app.setGlobalPrefix('/api');

  configureSecurityHeaders(app);
  await configureAzureStorage(app);

  app.useBodyParser('json', { limit: '100mb' });
  app.use(compression());
  await app.listen(1337);
}

async function configureAzureStorage(app: INestApplication) {
  const dataAccess = app.get<DataAccess>(DataAccess);

  await Promise.all([
    dataAccess.blobService.createStorageIfNotExists(),
    dataAccess.mutationTestingReportService.createStorageIfNotExists(),
    dataAccess.repositoryMapper.createStorageIfNotExists(),
  ]);
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
          imgSrc: [`'self'`, 'data:', 'https://avatars.githubusercontent.com', 'https://img.shields.io'],
          scriptSrcAttr: [`'unsafe-inline'`],
        },
      },
    }),
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
