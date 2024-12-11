/**
 * This script checks if a version of @stryker-mutator/dashboard-backend is available in the npm registry.
 */

import path from 'path';
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';

const [, , expectedVersion] = process.argv;

if (!expectedVersion) {
  console.info(`Usage: node ${path.basename(fileURLToPath(import.meta.url))} version`);
  console.info(`Example: node ${path.basename(fileURLToPath(import.meta.url))} 1.0.0\``);
  process.exitCode = 1;
} else {
  console.log(`Validating @stryker-mutator/dashboard-backend for version ${expectedVersion}`);
  tryCheckVersion();
}

async function tryCheckVersion(attemptsLeft = 40, timeToWait = 5000) {
  const { versions } = await (
    await fetch('https://registry.npmjs.org/@stryker-mutator/dashboard-backend', { cache: 'no-cache' })
  ).json();
  const version = versions[expectedVersion];

  if (version && versions[expectedVersion].dist.tarball) {
    console.log(`✅  ${expectedVersion} available for @stryker-mutator/dashboard-backend ^-^`);
    return;
  }

  if (attemptsLeft === 0) {
    console.error(`❌  Failed, ${expectedVersion} not found in @stryker-mutator/dashboard-backend`);
    process.exitCode = 1;
    return;
  } else {
    console.log(`${expectedVersion} not (yet) found in @stryker-mutator/dashboard-backend.`);
    console.log(`Retrying ${attemptsLeft} more time(s) in ${timeToWait / 1000} seconds...`);
    await setTimeout(timeToWait);
    await tryCheckVersion(attemptsLeft - 1, timeToWait + 1000);
  }
}
