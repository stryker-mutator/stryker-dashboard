import * as debug from 'debug';

export const requiredEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} not set.`);
    } else {
        return value;
    }
}

export const optionalEnvVar = (name: string, defaultValue: string): string => {
    const value = process.env[name];
    return !value ? defaultValue : value;
}

const config = {
    githubClientId: requiredEnvVar('GH_BASIC_CLIENT_ID'),
    githubSecret: requiredEnvVar('GH_BASIC_SECRET_ID'),
    isDevelopment: (optionalEnvVar('NODE_ENV', 'production') === 'development'),
    jwtSecret: requiredEnvVar('JWT_SECRET'),
    port: parseInt(requiredEnvVar('PORT'), 10),
}

debug('config')('Configuration read');
if (config.isDevelopment) debug('config')('Application running in dev mode!');

export default config;