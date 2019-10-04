const path = require('path');

exports.dist = path.resolve(__dirname, 'dist');
exports.version = require('./package.json').version;
