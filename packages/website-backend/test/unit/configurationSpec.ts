import config, { optionalEnvVar, requiredEnvVar, Configuration } from '../../src/configuration';
import { expect } from 'chai';
import * as utils from '../../src/utils';

describe('Configuration', () => {

    let envStub: sinon.SinonStub;

    const requiredOptions: { name: string, prop: keyof Configuration, var: string, val: string | number }[] = [
        { name: 'GitHub Client ID', prop: 'githubClientId', var: 'GH_BASIC_CLIENT_ID', val: 'gh-basic-client-id' },
        { name: 'GitHub secret', prop: 'githubSecret', var: 'GH_BASIC_SECRET_ID', val: 'secret-id' },
        { name: 'JWT secret', prop: 'jwtSecret', var: 'JWT_SECRET', val: 'jwt-secret' },
        { name: 'App port number', prop: 'port', var: 'PORT', val: 1337 },
    ];

    beforeEach(() => {
        envStub = sandbox.stub(utils, 'env');
        requiredOptions.forEach(option => {
            envStub.withArgs(option.var).returns(option.val);
        });
    });

    requiredOptions.forEach(option => {
        it(`should read ${option.name} from environment variable \'${option.var}\'`, () => {
            expect(config()[option.prop]).eq(option.val);
        });
    });

    it(`should provide default value for "Development mode"`, () => {
        expect(config().isDevelopment).eq(false);
    });

    describe('when an required option is not set', () => {
        it('should throw an error', () => {
            expect(() => requiredEnvVar('BOGUS')).throws(/BOGUS/);
        });
    });

    describe('when an optional option is set', () => {
        it('should return its value from the corresponding environment variable', () => {
            const option = requiredOptions[0];
            expect(optionalEnvVar(option.var, 'some value')).eq(option.val);
        });
    });

    describe('when an optional option is not set', () => {
        it('should return its default value', () => {
            expect(optionalEnvVar('BOGUS', 'sane default')).eq('sane default');
        });
    });
});