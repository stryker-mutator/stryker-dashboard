import { Module } from '@nestjs/common';
import Configuration from './services/Configuration.js';
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
import { GithubStrategy } from './github/Strategy.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './services/JwtConfigService.js';
import { JwtStrategy } from './services/JwtStrategy.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: dist,
      exclude: ['/api/(.*)'],
      serveStaticOptions: {
        immutable: true,
        maxAge: '1y',
      },
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
      extraProviders: [Configuration],
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
    GithubStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
