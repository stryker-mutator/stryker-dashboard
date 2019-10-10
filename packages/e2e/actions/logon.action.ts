import { browser } from 'protractor';
import jwt = require('jsonwebtoken');

export async function logOn() {
  if (process.env.E2E_JWT_SECRET) {
    const tokenOptions = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' };
    const authToken = jwt.sign({
      accessToken: process.env.E2E_ACCESS_TOKEN,
      displayName: null,
      id: 56148018,
      username: 'strykermutator-test-account',
    }, process.env.E2E_JWT_SECRET, tokenOptions);
    await browser.get('/');
    await browser.executeScript(`window.sessionStorage.setItem('authToken', '${authToken}');`);
    // await browser.get('/');
  } else {
    throw new Error('Missing JWT_SECRET env variable. Cannot simulate login.');
  }
}

export async function logOff() {
  await browser.executeScript('window.sessionStorage.removeItem("authToken")');
}
