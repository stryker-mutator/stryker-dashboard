/* eslint-disable */
// @ts-check
import fs from 'fs';
import { URL } from 'url';
const settings = JSON.parse(
  fs.readFileSync(
    new URL('../../stryker.parent.conf.json', import.meta.url),
    'utf-8'
  )
);
settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];

settings.testRunner = 'karma';
settings.karma = {
  projectType: 'angular-cli',
  configFile: 'src/karma.conf.js',
  config: {
    browsers: ['ChromeHeadless'],
  },
};
settings.coverageAnalysis = 'off';
settings.mutate = ['src/**/*.ts', '!src/**/*.spec.ts'];
settings.tsconfigFile = 'src/tsconfig.spec.json';
settings.transpilers = [];
settings.plugins = ['@stryker-mutator/*', '@stryker-mutator/karma-runner'];

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
