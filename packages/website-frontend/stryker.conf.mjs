import settings from '../../stryker.parent.conf.json' with { type: 'json' };

settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];

settings.testRunner = 'vitest';
settings.inPlace = true;
settings.mutate = ['src/**/*.ts', '!src/**/*.spec.ts', '!src/*.ts'];

settings.plugins = ['@stryker-mutator/*', '@stryker-mutator/vitest-runner'];

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
