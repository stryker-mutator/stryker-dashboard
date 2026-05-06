import cluster from 'node:cluster';
import os from 'node:os';

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

  app.useBodyParser('json', { limit: '100mb' });
  app.use(compression());
  const port = process.env.PORT ? parseFloat(process.env.PORT) : 1337;
  await app.listen(port, () => {
    log.log(`🚀  Server ready at http://localhost:${port}/`);
  });
}

async function configureAzureStorage(log: Logger) {
  const dataAccess = new DataAccess();

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

/**
 * Create a cluster of Node.js processes to take advantage of multi-core systems.
 */
function forkClusterWorkers(log: Logger) {
  const numWorkers = parseInt(process.env.WEB_CONCURRENCY!, 10) || os.availableParallelism();
  log.log(`Running with ${numWorkers} workers`);
  // Fork workers.
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    log.log(`Worker ${worker.process.pid} died (${signal || code})`);
  });
}

if (cluster.isPrimary) {
  const log = new Logger('primary');
  await configureAzureStorage(log);
  forkClusterWorkers(log);
} else {
  await bootstrap();
}
