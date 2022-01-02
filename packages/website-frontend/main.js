const path = require('path');

exports.dist = path.resolve(__dirname, 'dist', 'stryker-mutator', 'dashboard-frontend');
exports.version = require('./package.json').version;
