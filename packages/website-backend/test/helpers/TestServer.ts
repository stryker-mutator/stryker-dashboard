import { ServerLoader, IServerSettings, Type, OverrideService, ExpressApplication } from 'ts-express-decorators';
import { ProjectMapper, MutationScoreMapper } from 'stryker-dashboard-data-access';
import { bootstrap, inject } from 'ts-express-decorators/testing';
import Configuration from '../../src/services/Configuration';
import * as supertest from 'supertest';
import { SuperTest, Test } from 'supertest';
import DataAccess from '../../src/services/DataAccess';
import { Mock, createMock } from './mock';
import { Request, Response, NextFunction } from 'express';
import { Authentication } from '../../src/github/models';
import GithubRepositoryService from '../../src/services/GithubRepositoryService';

@OverrideService(Configuration)
class ConfigurationStub implements Configuration {
    static githubClientId: string;
    get githubClientId() { return ConfigurationStub.githubClientId; }
    static githubSecret: string;
    get githubSecret() { return ConfigurationStub.githubSecret; }
    static baseUrl: string;
    get baseUrl() { return ConfigurationStub.baseUrl; }
    static jwtSecret: string;
    get jwtSecret() { return ConfigurationStub.jwtSecret; }
    static isDevelopment: boolean;
    get isDevelopment() { return ConfigurationStub.isDevelopment; }
}

@OverrideService(DataAccess)
export class DataAccessStub implements DataAccess {
    public static repositoryMapper: Mock<ProjectMapper>;
    public static mutationScoreMapper: Mock<MutationScoreMapper>;
    public get repositoryMapper(): ProjectMapper {
        return DataAccessStub.repositoryMapper as any;
    }
    public get mutationScoreMapper(): MutationScoreMapper {
        return DataAccessStub.mutationScoreMapper as any;
    }
}

@OverrideService(GithubRepositoryService)
export class RepositoryServiceStub {
    static getAllForUser: sinon.SinonStub;
    static getAllForOrganization: sinon.SinonStub;
    static update: sinon.SinonStub;
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
    DataAccessStub.repositoryMapper = createMock(ProjectMapper);
    DataAccessStub.mutationScoreMapper = createMock(MutationScoreMapper);
    RepositoryServiceStub.getAllForOrganization = sandbox.stub();
    RepositoryServiceStub.getAllForUser = sandbox.stub();
    RepositoryServiceStub.update = sandbox.stub();
});

export default async function testServer<TController>(Controller: Type<TController>, user?: Authentication, ...middlewares: any[])
    : Promise<SuperTest<Test>> {
    let request: SuperTest<Test> = null as any;
    class TestServer extends ServerLoader {
        constructor() {
            super();
            const resetSettings: IServerSettings = {
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
        $onMountingMiddlewares() {
            if (user) {
                this.use((req: Request, res: Response, next: NextFunction) => {
                    req.user = user;
                    next();
                });
            }
            if (middlewares.length) {
                this.use(...middlewares);
            }
        }
    }
    await bootstrapAsPromised(TestServer);
    await injectAsPromised([ExpressApplication], (app: ExpressApplication) => {
        request = supertest(app);
    });
    return request;
}

function bootstrapAsPromised(ServerConstructor: any): Promise<any> {
    return new Promise((res) => {
        bootstrap(ServerConstructor)(res);
    });
}

function injectAsPromised(targets: any[], func: (...args: any[]) => any): Promise<any> {
    return new Promise((res) => {
        inject(targets, func)(res);
    });
}