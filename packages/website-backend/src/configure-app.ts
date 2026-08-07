import type { IncomingMessage } from 'node:http';

import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request } from 'express';

export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix('/api');

  // The dashboard runs behind a TLS terminating proxy. Trust it, otherwise express treats every request as plain
  // http and `secure` cookies are dropped without a warning.
  app.set('trust proxy', 1);

  app.useBodyParser('json', { limit: '100mb', type: parseUnlessOAuthCallback('json') });
  app.useBodyParser('urlencoded', { type: parseUnlessOAuthCallback('urlencoded') });
}

/**
 * Parse the given content type for every route except the GitHub OAuth callback, as openid-client reads the OAuth
 * code exchange from the raw request stream.
 */
function parseUnlessOAuthCallback(contentType: string) {
  return (req: IncomingMessage) => !isOAuthCallback(req) && Boolean((req as Request).is(contentType));
}

/**
 * The one route where the request body must survive unparsed
 */
const OAUTH_CALLBACK_PATH = '/api/auth/github';

function isOAuthCallback(req: IncomingMessage) {
  return req.method === 'POST' && req.url?.split('?')[0] === OAUTH_CALLBACK_PATH;
}
