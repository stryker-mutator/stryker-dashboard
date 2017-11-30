import { ServerLoader, IServerSettings, Type, OverrideService, ExpressApplication } from 'ts-express-decorators';
import { bootstrap, inject } from 'ts-express-decorators/testing';
import Configuration from '../../src/services/Configuration';
import * as supertest from 'supertest';
import { SuperTest, Test } from 'supertest';


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

beforeEach(() => {
    ConfigurationStub.githubClientId = 'github client id';
    ConfigurationStub.githubSecret = 'github secret';
    ConfigurationStub.jwtSecret = 'jwt secret';
    ConfigurationStub.baseUrl = 'base url';
    ConfigurationStub.isDevelopment = true;
});

export default async function testServer<TController>(Controller: Type<TController>, ...middlewares: any[]): Promise<SuperTest<Test>> {
    let request: SuperTest<Test> = null as any;
    class TestServer extends ServerLoader {
        constructor() {
            super();
            const resetSettings: IServerSettings = {
                componentsScan: [],
                mount: {}
            };
            this.setSettings(resetSettings);
            this.addComponents(ConfigurationStub);
            this.addControllers('/', [Controller]);
        }
        $onMountingMiddlewares() {
            this.use(...middlewares);
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

function injectAsPromised(targets: any[], func: Function): Promise<any> {
    return new Promise((res) => {
        inject(targets, func)(res);
    });
}