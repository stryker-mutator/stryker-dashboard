import fs from 'fs';
import { URL } from 'url';

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
const settings = JSON.parse(fs.readFileSync(new URL('../../stryker.parent.conf.json', import.meta.url), 'utf-8'));
settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];
settings.mutate = ['badge/**/*.ts'];
settings.mochaOptions = {
  spec: ['dist/test/helpers/**/*.js', 'dist/test/badge/**/*.js'],
};

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
