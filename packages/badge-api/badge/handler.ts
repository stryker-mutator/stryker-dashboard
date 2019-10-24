import { Context, AzureFunction } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper';
import { determineProjectAndVersion, InvalidSlugError } from '@stryker-mutator/dashboard-data-access';
const headers = {
  ['X-Badge-Api-Version']: require('../../package.json').version
};

export function handler(mapper: ShieldMapper): AzureFunction {
  return async (context: Context): Promise<void> => {
    const {
      slug,
      module: moduleName
    } = context.bindingData;
    try {
      const { projectName, version } = determineProjectAndVersion(slug);

      context.res = {
        headers,
        body: await mapper.shieldFor(projectName, version, moduleName)
      };
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        context.log.info('Handling invalid request: ', error);
        context.res = {
          status: 400,
          headers,
          body: error.message
        };
      } else {
        context.log.error('Internal server error', error);
        context.res = {
          status: 500,
          headers,
          body: 'Internal server error.'
        };
      }
    }
  };
}
