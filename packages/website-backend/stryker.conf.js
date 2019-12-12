const path = require('path');
const settings = require('../../stryker.parent.conf');
settings.dashboard.module = __dirname.split(path.sep).pop();
module.exports = settings;