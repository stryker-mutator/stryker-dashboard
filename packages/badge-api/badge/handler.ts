import fs from 'fs';
import { Context, AzureFunction } from '@azure/functions';
import { Slug, InvalidSlugError } from '@stryker-mutator/dashboard-common';
import { ShieldMapper } from './ShieldMapper.js';

const headers = {
  ['X-Badge-Api-Version']: JSON.parse(
    fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
  ).version,
};

export function handler(mapper: ShieldMapper): AzureFunction {
  return async (context: Context): Promise<void> => {
    const { slug, module: moduleName } = context.bindingData as {
      invocationId: string;
      slug: string | undefined;
      module: string | undefined;
    };
    try {
      const { project, version } = Slug.parse(slug);

      context.res = {
        headers,
        body: await mapper.shieldFor(project, version, moduleName),
      };
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        context.log.info('Handling invalid request: ', error);
        context.res = {
          status: 400,
          headers,
          body: error.message,
        };
      } else {
        context.log.error('Internal server error', error);
        context.res = {
          status: 500,
          headers,
          body: 'Internal server error.',
        };
      }
    }
  };
}
