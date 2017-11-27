import * as debug from 'debug';
import { env } from './utils';

export const requiredEnvVar = (name: string): string => {
    const value = env(name);
    if (!value) {
        throw new Error(`Environment variable ${name} not set.`);
    } else {
        return value;
    }
}

export const optionalEnvVar = (name: string, defaultValue: string): string => {
    const value = env(name);
    return !value ? defaultValue : value;
}

export interface Configuration {
    githubClientId: string;
    githubSecret: string;
    isDevelopment: boolean;
    baseUrl: string,
    jwtSecret: string;
    port: number;
}

export default (): Configuration => {
    const config = {
        githubClientId: requiredEnvVar('GH_BASIC_CLIENT_ID'),
        githubSecret: requiredEnvVar('GH_BASIC_SECRET_ID'),
        isDevelopment: (optionalEnvVar('NODE_ENV', 'production') === 'development'),
        baseUrl: (optionalEnvVar('STRYKER_BADGE_BASE_URL', '')),
        jwtSecret: requiredEnvVar('JWT_SECRET'),
        port: parseInt(requiredEnvVar('PORT'), 10),
    }

    debug('config')('Configuration read');
    if (config.isDevelopment) {
        debug('config')('Application running in dev mode!');
    }else {
        debug('config')('Application running in prod mode!');
    }
    return config;
}