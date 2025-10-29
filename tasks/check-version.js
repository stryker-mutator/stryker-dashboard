// @ts-check
/**
 * This task checks if the version of the badge-api or dashboard is correct according to the expectation.
 */

import path from 'path';
import { fileURLToPath } from 'url';

let [, , type, url, expectedVersion] = process.argv;
expectedVersion = expectedVersion.trim().replace(/^v/, ''); // remove leading v if present
console.log(`Validating ${url} for version ${expectedVersion}`);
if ((url && expectedVersion && type === 'dashboard') || type === 'badge-api') {
  await tryCheckVersion();
} else {
  console.info(`Usage: node ${path.basename(fileURLToPath(import.meta.url))} [badge-api/dashboard] url version`);
  console.info(
    `Example: node ${path.basename(
      fileURLToPath(import.meta.url),
    )} dashboard https://dashboard.stryker-mutator.io/api/version 1.0.0\``,
  );
  process.exitCode = 1;
}

async function tryCheckVersion(attemptsLeft = 40) {
  try {
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort('Request timed out'), 10_000);
    const res = await fetch(url, { signal: abort.signal });
    clearTimeout(timeout);

    await checkResponse(res);
  } catch (err) {
    if (attemptsLeft === 0) {
      console.error(err);
      process.exitCode = 1;
    } else {
      console.log(`Failed, ${err} trying ${attemptsLeft} more time(s)`);
      setTimeout(() => tryCheckVersion(attemptsLeft - 1), 10000);
    }
  }
}

/**
 * @param {Response} resp
 */
async function checkResponse(resp) {
  if (type === 'dashboard') {
    await verifyDashboardVersion(resp);
  } else {
    verifyBadgeApiVersion(resp);
  }
  console.log(`✅  ${expectedVersion} installed at ${url} ^-^`);
}

/**
 * @param {Response} resp
 */
function verifyBadgeApiVersion(resp) {
  const actual = trimGitShaPostFix(resp.headers.get('x-badge-api-version'));
  if (actual !== expectedVersion) {
    throw new Error(`Expected ${actual} to equal ${expectedVersion}`);
  }
}

/**
 * @param {string | null} rawVersion
 */
function trimGitShaPostFix(rawVersion) {
  return rawVersion?.split('+')[0];
}

/**
 * @param {Response} resp
 */
async function verifyDashboardVersion(resp) {
  if (!resp.ok) {
    throw new Error(`Request failed with status ${resp.status} ${resp.statusText}`);
  }

  const actual = await resp.json();
  const expected = {
    dashboard: expectedVersion,
    frontend: expectedVersion,
  };
  if (actual.dashboard !== expected.dashboard || actual.frontend !== expected.frontend) {
    throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
  }
}
