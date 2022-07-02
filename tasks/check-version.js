/* eslint-disable no-undef */
/**
 * This task checks if the version of the badge-api or dashboard is correct according to the expectation.
 */

import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';

function httpClient() {
  if (url.startsWith('https://')) {
    return https.get;
  } else {
    return http.get;
  }
}

const [, , type, url, expectedVersion] = process.argv;
console.log(`Validating ${url} for version ${expectedVersion}`);
if ((url && expectedVersion && type === 'dashboard') || type === 'badge-api') {
  tryCheckVersion();
} else {
  console.info(
    `Usage: node ${path.basename(
      fileURLToPath(import.meta.url)
    )} [badge-api/dashboard] url version`
  );
  console.info(
    `Example: node ${path.basename(
      fileURLToPath(import.meta.url)
    )} dashboard https://dashboard.stryker-mutator.io/api/version 1.0.0\``
  );
  process.exitCode = 1;
}

function tryCheckVersion(attemptsLeft = 40) {
  httpClient()(url, (res) => {
    checkResponse(res).catch((err) => {
      if (attemptsLeft === 0) {
        console.error(err);
        process.exitCode = 1;
      } else {
        console.log(`Failed, ${err} trying ${attemptsLeft} more time(s)`);
        setTimeout(() => tryCheckVersion(attemptsLeft - 1), 10000);
      }
    });
  });
}

async function checkResponse(resp) {
  if (type === 'dashboard') {
    await verifyDashboardVersion(resp);
  } else {
    verifyBadgeApiVersion(resp);
  }
  console.log(`✅  ${expectedVersion} installed at ${url} ^-^`);
}

function verifyBadgeApiVersion(resp) {
  const actual = trimGitShaPostFix(resp.headers['x-badge-api-version']);
  if (actual !== expectedVersion) {
    throw new Error(`Expected ${actual} to equal ${expectedVersion}`);
  }
}

function trimGitShaPostFix(rawVersion) {
  return rawVersion.split('+')[0];
}

function verifyDashboardVersion(resp) {
  return new Promise((res, rej) => {
    let data = '';
    resp.on('data', (chunk) => (data += chunk));
    resp.on('end', () => {
      const actual = JSON.parse(data);
      const expected = {
        dashboard: expectedVersion,
        frontend: expectedVersion,
      };
      try {
        if (
          actual.dashboard !== expected.dashboard ||
          actual.frontend !== expected.frontend
        ) {
          throw new Error(
            `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(
              expected
            )}`
          );
        }
        res();
      } catch (err) {
        rej(err);
      }
    });
    resp.on('err', (err) => rej(err));
  });
}
