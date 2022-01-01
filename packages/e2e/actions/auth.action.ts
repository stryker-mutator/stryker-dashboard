import { Page } from '@playwright/test';
import jwt = require('jsonwebtoken');
import { getEnvVariable } from './helpers.action';

function getJwtSecret() {
  return getEnvVariable('E2E_JWT_SECRET');
}

function getAccessToken() {
  return getEnvVariable('E2E_ACCESS_TOKEN');
}

export function generateAuthToken(): string {
  const tokenOptions = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' };
  const authToken = jwt.sign({
    accessToken: getAccessToken(),
    displayName: null,
    id: 56148018,
    username: 'strykermutator-test-account',
  }, getJwtSecret(), tokenOptions);
  return authToken;
}

export async function logOn(page: Page) {
  const authToken = generateAuthToken();
  await page.goto('/');
  await page.evaluate(`window.sessionStorage.setItem('authToken', '${authToken}');`);
}

export async function logOff(page: Page) {
  await page.evaluate('window.sessionStorage.removeItem("authToken")');
}
