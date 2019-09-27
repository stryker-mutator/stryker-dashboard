import { Type } from '@tsed/core';
import { ServerLoader, IServerSettings, OverrideService, ExpressApplication, ServerSettings } from '@tsed/common';
import { ProjectMapper, MutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';
import { bootstrap, inject, TestContext } from '@tsed/testing';
import Configuration from '../../src/services/Configuration';
import supertest from 'supertest';
import { SuperTest, Test } from 'supertest';
import DataAccess from '../../src/services/DataAccess';
import GithubRepositoryService from '../../src/services/GithubRepositoryService';
import sinon = require('sinon');
import bodyParser = require('body-parser');
import { Authentication } from '../../src/github/models';
import { createToken } from '../../src/middleware/securityMiddleware';

@OverrideService(Configuration)
class ConfigurationStub implements Configuration {
  public static githubClientId: string;
  get githubClientId() { return ConfigurationStub.githubClientId; }
  public static githubSecret: string;
  get githubSecret() { return ConfigurationStub.githubSecret; }
  public static baseUrl: string;
  get baseUrl() { return ConfigurationStub.baseUrl; }
  public static jwtSecret: string;
  get jwtSecret() { return ConfigurationStub.jwtSecret; }
  public static isDevelopment: boolean;
  get isDevelopment() { return ConfigurationStub.isDevelopment; }
}

@OverrideService(DataAccess)
export class DataAccessStub implements DataAccess {
  public static repositoryMapper: sinon.SinonStubbedInstance<ProjectMapper>;
  public static mutationTestingReportMapper: sinon.SinonStubbedInstance<MutationTestingReportMapper>;
  public get repositoryMapper(): ProjectMapper {
    return DataAccessStub.repositoryMapper as any;
  }
  public get mutationTestingReportMapper(): MutationTestingReportMapper {
    return DataAccessStub.mutationTestingReportMapper as any;
  }
}

export async function createAuthToken(user: Authentication) {
  const token = await createToken(user, ConfigurationStub.jwtSecret);
  return `Bearer ${token}`;
}

@OverrideService(GithubRepositoryService)
export class RepositoryServiceStub {
  public static getAllForUser: sinon.SinonStub;
  public static getAllForOrganization: sinon.SinonStub;
  public static update: sinon.SinonStub;
  public get getAllForUser() {
    return RepositoryServiceStub.getAllForUser;
  }
  public get getAllForOrganization() {
    return RepositoryServiceStub.getAllForOrganization;
  }
  public get update() {
    return RepositoryServiceStub.update;
  }
}

beforeEach(() => {
  ConfigurationStub.githubClientId = 'github client id';
  ConfigurationStub.githubSecret = 'github secret';
  ConfigurationStub.jwtSecret = 'jwt secret';
  ConfigurationStub.baseUrl = 'base url';
  ConfigurationStub.isDevelopment = true;
  DataAccessStub.repositoryMapper = {
    createStorageIfNotExists: sinon.stub(),
    findAll: sinon.stub(),
    insertOrMergeEntity: sinon.stub(),
    findOne: sinon.stub()
  };
  DataAccessStub.mutationTestingReportMapper = {
    createStorageIfNotExists: sinon.stub(),
    findAll: sinon.stub(),
    insertOrMergeEntity: sinon.stub(),
    findOne: sinon.stub()
  };
  RepositoryServiceStub.getAllForOrganization = sinon.stub();
  RepositoryServiceStub.getAllForUser = sinon.stub();
  RepositoryServiceStub.update = sinon.stub();
});

afterEach(async () => {
  TestContext.reset();
  sinon.restore();
});

export default async function testServer<TController>(Controller: Type<TController>, ...middlewares: import('express').RequestHandler[])
  : Promise<SuperTest<Test>> {
  let request: SuperTest<Test> = null as any;
  @ServerSettings({
    logger: {
      level: 'off' as any
    }
  })
  class TestServer extends ServerLoader {
    constructor() {
      super();

      const resetSettings: Partial<IServerSettings> = {
        componentsScan: [],
        mount: {}
      };
      this.setSettings(resetSettings);
      this.addComponents([
        ConfigurationStub,
        DataAccessStub,
        RepositoryServiceStub
      ]);
      this.addControllers('/', [Controller]);
    }
    public $beforeRoutesInit() {
      if (middlewares.length) {
        this.use(...middlewares);
      }
      this.use(bodyParser.json());
    }
  }
  await bootstrap(TestServer)();
  await inject([ExpressApplication], (app: ExpressApplication) => {
    request = supertest(app);
  })();
  return request;
}
