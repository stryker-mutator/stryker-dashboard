import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import Configuration from './services/Configuration.js';
import {
  GithubSecurityMiddleware,
  passportAuthenticateGithub,
} from './middleware/security.middleware.js';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import AuthController from './controllers/auth.controller.js';
import UserController from './controllers/user.controller.js';
import DataAccess from './services/DataAccess.js';
import GithubAgent from './github/GithubAgent.js';
import HttpClient from './client/HttpClient.js';
import GithubRepositoryService from './services/GithubRepositoryService.js';
import OrganizationsController from './controllers/organizations.controller.js';
import RepositoriesController from './controllers/repositories.controller.js';
import { OldReportsController } from './controllers/old-reports.controller.js';
import VersionController from './controllers/version.controller.js';
import { ApiKeyValidator } from './services/ApiKeyValidator.js';
import ReportsController from './controllers/reports.controller.js';
import RealTimeReportsController from './controllers/real-time-reports.controller.js';
import { ReportValidator } from './services/ReportValidator.js';
import MutationEventResponseOrchestrator from './services/real-time/MutationEventResponseOrchestrator.js';
import { dist } from '@stryker-mutator/dashboard-frontend';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: dist,
      serveStaticOptions: {
        immutable: true,
        maxAge: '1y',
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
    Configuration,
    DataAccess,
    GithubAgent,
    GithubRepositoryService,
    HttpClient,
    MutationEventResponseOrchestrator,
    ReportValidator,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passportAuthenticateGithub)
      .forRoutes({ path: 'auth/github', method: RequestMethod.POST });

    consumer
      .apply(GithubSecurityMiddleware)
      .forRoutes('organizations', 'repositories', 'user');
  }
}
