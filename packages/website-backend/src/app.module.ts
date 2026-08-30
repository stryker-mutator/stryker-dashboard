import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { deriveKey } from '@stryker-mutator/dashboard-common/crypto';
import cookieSession from 'cookie-session';
import { fileURLToPath } from 'url';

import { ApiKeyGuard, JwtAuthGuard } from './auth/guard.js';
import HttpClient from './client/HttpClient.js';
import AuthController from './controllers/auth.controller.js';
import { OldReportsController } from './controllers/old-reports.controller.js';
import OrganizationsController from './controllers/organizations.controller.js';
import RealTimeReportsController from './controllers/real-time-reports.controller.js';
import ReportsController from './controllers/reports.controller.js';
import RepositoriesController from './controllers/repositories.controller.js';
import UserController from './controllers/user.controller.js';
import VersionController from './controllers/version.controller.js';
import GithubAgent from './github/GithubAgent.js';
import { GithubStrategy } from './github/Strategy.js';
import { ApiKeyValidator } from './services/ApiKeyValidator.js';
import { AuthTokenService } from './services/AuthTokenService.js';
import Configuration from './services/Configuration.js';
import DataAccess from './services/DataAccess.js';
import GithubRepositoryService from './services/GithubRepositoryService.js';
import { JwtStrategy } from './services/JwtStrategy.js';
import MutationEventResponseOrchestrator from './services/real-time/MutationEventResponseOrchestrator.js';
import { ReportValidator } from './services/ReportValidator.js';

const dist = fileURLToPath(import.meta.resolve('@stryker-mutator/dashboard-frontend/dist'));

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({}),
    ServeStaticModule.forRoot({
      rootPath: dist,
      exclude: ['/api/*apiPath'],
      serveStaticOptions: {
        immutable: true,
        maxAge: '1y',
        index: false,
      },
    }),
  ],
  controllers: [
    AuthController,
    OldReportsController,
    OrganizationsController,
    RealTimeReportsController,
    ReportsController,
    RepositoriesController,
    UserController,
    VersionController,
  ],
  providers: [
    ApiKeyValidator,
    AuthTokenService,
    Configuration,
    DataAccess,
    GithubAgent,
    GithubRepositoryService,
    HttpClient,
    MutationEventResponseOrchestrator,
    ReportValidator,
    GithubStrategy,
    JwtStrategy,
    JwtAuthGuard,
    ApiKeyGuard,
  ],
})
export class AppModule implements NestModule {
  #config: Configuration;

  constructor(config: Configuration) {
    this.#config = config;
  }

  /**
   * Set up cookie-based session only used for OAuth flow, to verify state
   */
  async configure(consumer: MiddlewareConsumer): Promise<void> {
    const key = await deriveKey(this.#config.jwtSecret, 'oauth-session');
    consumer
      .apply(
        cookieSession({
          name: 'stryker-dashboard-oauth',
          keys: [Buffer.from(key).toString('base64url')],
          httpOnly: true,
          sameSite: 'strict',
          secure: new URL(this.#config.baseUrl).protocol === 'https:',
          maxAge: 15 * 60 * 1000,
          path: '/api/auth/github',
        }),
      )
      .forRoutes(AuthController);
  }
}
