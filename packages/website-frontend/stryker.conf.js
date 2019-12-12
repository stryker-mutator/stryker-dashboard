const path = require('path');
const settings = require('../../stryker.parent.conf');
settings.dashboard.module = __dirname.split(path.sep).pop();

settings.testRunner = 'karma';
settings.karma = {
  projectType: 'angular-cli',
  configFile: 'src/karma.conf.js',
  config: {
    browsers: ['ChromeHeadless']
  }
}
settings.coverageAnalysis = 'off';
settings.mutate = [
  'src/**/*.ts',
  '!src/**/*.spec.ts'
];
settings.tsconfigFile = 'src/tsconfig.spec.json';
settings.transpilers = [];
settings.plugins = [
  '@stryker-mutator/*',
  require.resolve('@stryker-mutator/karma-runner')
];

module.exports = settings;
