// @ts-check
import fs from 'fs';
import { URL } from 'url';

const settings = JSON.parse(fs.readFileSync(new URL('../../stryker.parent.conf.json', import.meta.url), 'utf-8'));
settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];

settings.testRunner = 'vitest';
settings.inPlace = true;
settings.mutate = ['src/**/*.ts', '!src/**/*.spec.ts', '!src/*.ts'];

settings.plugins = ['@stryker-mutator/*', '@stryker-mutator/vitest-runner'];

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
