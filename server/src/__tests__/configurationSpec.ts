import config, { requiredEnvVar } from '../configuration';

describe('Configuration', () => {
    const options = [
        { name: 'GitHub Client ID'   , prop: 'githubClientId', var: 'GH_BASIC_CLIENT_ID' },
        { name: 'GitHub secret'      , prop: 'githubSecret'  , var: 'GH_BASIC_SECRET_ID' },
        { name: 'JWT secret'         , prop: 'jwtSecret'     , var: 'JWT_SECRET' },
        { name: 'App port number'    , prop: 'port'          , var: 'PORT' },
    ];

    options.forEach(option => {
        it(`should have an environment variable ${option.var}`, () => {
            expect(process.env[option.var]).toBeDefined();
        });
        it(`should read ${option.name} from environment variable \'${option.var}\'`, () => {
            expect(config[option.prop].toString()).toEqual(process.env[option.var])
        });
    });

    describe('when an required option is not set', () => {
        it('should throw an error', () => {
            expect(() => {
                requiredEnvVar('BOGUS');
            }).toThrowError(/BOGUS/);
        });     
    });
});