import { AuthTokenCodec } from '@stryker-mutator/dashboard-common/crypto';

import { getEnvVariable, getOptionalEnvVariable } from './helpers.action.js';

function getJwtSecret() {
  return getEnvVariable('E2E_JWT_SECRET');
}

function getAccessToken() {
  return getEnvVariable('E2E_ACCESS_TOKEN');
}

/**
 * Creates the same encrypted JWT (JWE) the backend hands out after a successful GitHub sign in.
 */
export function generateAuthToken(): Promise<string> {
  return new AuthTokenCodec(getJwtSecret()).create({
    accessToken: getAccessToken(),
    displayName: null,
    id: 56148018,
    username: getOptionalEnvVariable('E2E_GITHUB_USER_NAME', 'strykermutator-test-account'),
  });
}
