import settings from '../../stryker.parent.conf';
settings.dashboard.module = import.meta.url.split('/').slice(-2)[0];
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default settings;
