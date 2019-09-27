import { Context, AzureFunction } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper';
import { determineRepoSlugAndVersion, InvalidSlugError } from '@stryker-mutator/dashboard-data-access';

export function handler(mapper: ShieldMapper): AzureFunction {
  return async (context: Context): Promise<void> => {
    const {
      slug,
      module: moduleName
    } = context.bindingData;
    try {
      const { repositorySlug, version } = determineRepoSlugAndVersion(slug);

      context.res = {
        body: await mapper.shieldFor(repositorySlug, version, moduleName)
      };
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        context.log.info('Handling invalid request: ', error);
        context.res = {
          status: 400,
          body: error.message
        };
      } else {
        context.log.error('Internal server error', error);
        context.res = {
          status: 500,
          body: 'Internal server error.'
        };
      }
    }
  };
}
