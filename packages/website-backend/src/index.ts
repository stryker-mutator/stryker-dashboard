import { type INestApplication, Logger } from '@nestjs/common';
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
  const log = new Logger('bootstrap');
  await configureAzureStorage(app, log);

  app.useBodyParser('json', { limit: '100mb' });
  app.use(compression());
  const port = process.env.PORT ? parseFloat(process.env.PORT) : 1337;
  await app.listen(port, () => {
    log.log(`🚀  Server ready at http://localhost:${port}/`);
  });
}

async function configureAzureStorage(app: INestApplication, log: Logger) {
  const dataAccess = app.get<DataAccess>(DataAccess);

  log.log('Initializing Azure Storage containers...');
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
