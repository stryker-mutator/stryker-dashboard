import settings from '../../stryker.parent.conf.json' with { type: 'json' };

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];
settings.mutate = ['badge/**/*.ts'];
settings.mochaOptions = {
  spec: ['dist/test/helpers/**/*.js', 'dist/test/badge/**/*.js'],
};

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
