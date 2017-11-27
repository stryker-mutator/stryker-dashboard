import { Configuration } from '../../src/configuration';

function factory<T>(defaultFn: () => T) {
    return (overrides?: Partial<T>) => {
        return Object.assign(defaultFn(), overrides);
    }
}

export const config = factory<Configuration>(() => ({
    githubClientId: 'gh-client-id',
    githubSecret: 'gh-secret',
    isDevelopment: true,
    jwtSecret: 'jwt-secret',
    baseUrl: 'https://foobar.com',
    port: 80
}));
