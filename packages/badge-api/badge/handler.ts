import type { HttpHandler } from '@azure/functions';
import { InvalidSlugError, Slug } from '@stryker-mutator/dashboard-common';
import fs from 'fs';

import type { ShieldMapper } from './ShieldMapper.js';

const headers = {
  ['X-Badge-Api-Version']: (
    JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')) as { version: string }
  ).version,
};

export function handler(mapper: ShieldMapper): HttpHandler {
  return async (request, context) => {
    const slug = request.params.slug ?? undefined;
    const moduleName = request.query.get('module') ?? undefined;

    try {
      const { project, version } = Slug.parse(slug);

      return {
        headers,
        jsonBody: await mapper.shieldFor(project, version, moduleName),
      };
    } catch (error) {
      if (error instanceof InvalidSlugError) {
        context.info('Handling invalid request: ', error);
        return {
          status: 400,
          headers,
          body: error.message,
        };
      } else {
        context.error('Internal server error', error);
        return {
          status: 500,
          headers,
          body: 'Internal server error.',
        };
      }
    }
  };
}
