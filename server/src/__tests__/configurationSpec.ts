import config, { optionalEnvVar, requiredEnvVar } from '../configuration';

describe('Configuration', () => {
    const optionalOptions = [
        { name: 'Development mode'   , prop: 'isDevelopment' , defaultValue: false },
    ];
    const requiredOptions = [
        { name: 'GitHub Client ID'   , prop: 'githubClientId', var: 'GH_BASIC_CLIENT_ID' },
        { name: 'GitHub secret'      , prop: 'githubSecret'  , var: 'GH_BASIC_SECRET_ID' },
        { name: 'JWT secret'         , prop: 'jwtSecret'     , var: 'JWT_SECRET' },
        { name: 'App port number'    , prop: 'port'          , var: 'PORT' },
    ];

    requiredOptions.forEach(option => {
        it(`should have an environment variable ${option.var}`, () => {
            expect(process.env[option.var]).toBeDefined();
        });
        it(`should read ${option.name} from environment variable \'${option.var}\'`, () => {
            expect(config[option.prop].toString()).toEqual(process.env[option.var])
        });
    });
    
    optionalOptions.forEach(option => {
        it(`should provide default value for ${option.name}`, () => {
            expect(config[option.prop].toString()).toEqual(option.defaultValue.toString())
        });
    });

    describe('when an required option is not set', () => {
        it('should throw an error', () => {
            expect(() => requiredEnvVar('BOGUS')).toThrowError(/BOGUS/);
        });     
    });
    
    describe('when an optional option is set', () => {
        it('should return its value from the corresponding environment variable', () => {
            const option = requiredOptions[0];
            expect(optionalEnvVar(option.var, undefined)).toEqual(process.env[option.var]);
        });     
    });
    
    describe('when an optional option is not set', () => {
        it('should return its default value', () => {
            expect(optionalEnvVar('BOGUS', 'sane default')).toEqual('sane default');
        });     
    });
});