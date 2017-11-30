import * as requestPromiseNative from 'request-promise-native';

export function env(key: string) {
    return process.env[key];
}

export const request = requestPromiseNative;