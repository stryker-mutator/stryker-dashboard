import jwt from 'jsonwebtoken';
import { getEnvVariable, getOptionalEnvVariable } from './helpers.action.js';

function getJwtSecret() {
  return getEnvVariable('E2E_JWT_SECRET');
}

function getAccessToken() {
  return getEnvVariable('E2E_ACCESS_TOKEN');
}

export function generateAuthToken(): string {
  const tokenOptions: jwt.SignOptions = {
    algorithm: 'HS512',
    audience: 'stryker',
    expiresIn: '30m',
    issuer: 'stryker',
  };
  const authToken = jwt.sign(
    {
      accessToken: getAccessToken(),
      displayName: null,
      id: 56148018,
      username: getOptionalEnvVariable('E2E_GITHUB_USER_NAME', 'strykermutator-test-account'),
    },
    getJwtSecret(),
    tokenOptions,
  );
  return authToken;
}
