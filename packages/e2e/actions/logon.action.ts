import { browser } from 'protractor';
import jwt = require('jsonwebtoken');

let authToken = '';
export async function logOn() {
  if (process.env.E2E_JWT_SECRET) {
    if (!authToken) {
      const tokenOptions = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' };
      authToken = jwt.sign({
        accessToken: 'ab5a9155d852b302842a7295a4c2eeaa4d27fa2f',
        displayName: null,
        id: 56148018,
        username: 'strykermutator-test-account',
      }, process.env.E2E_JWT_SECRET, tokenOptions);
      await browser.get('/');
    }
    await browser.executeScript(`window.sessionStorage.setItem('authToken', '${authToken}');`);
    // await browser.get('/');
  } else {
    throw new Error('Missing JWT_SECRET env variable. Cannot simulate login.');
  }
}

export async function logOff() {
  await browser.executeScript('window.sessionStorage.removeItem("authToken")');
}
