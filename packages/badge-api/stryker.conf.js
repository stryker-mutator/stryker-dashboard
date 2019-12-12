const path = require('path');
const settings = require('../../stryker.parent.conf');
const moduleName = __dirname.split(path.sep).pop();
settings.mutate = ['badge/**/*.ts'];
settings.tsconfigFile = 'tsconfig.json';
settings.dashboard.module = moduleName;
settings.mochaOptions.spec = ['dist/test/**/*.js'];
module.exports = settings;