import debugFn = require('debug');
import uuid = require('uuid');
const { sha512_256 } = require('js-sha512');

export function env(key: string) {
    return process.env[key];
}

export const debug = debugFn;

export const requiredEnvVar = (name: string): string => {
    const value = env(name);
    if (!value) {
        throw new Error(`Environment variable ${name} not set.`);
    } else {
        return value;
    }
};

export const optionalEnvVar = (name: string, defaultValue: string): string => {
    const value = env(name);
    return !value ? defaultValue : value;
};

export function generateApiKey(): string {
    return uuid.v4();
}

export function generateHashValue(value: string): string {
    return sha512_256(value);
}