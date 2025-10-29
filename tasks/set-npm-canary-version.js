/**
 * This file will determine the next canary version number, setting it in the npm-package-version output variable for all next actions to use.
 * Instead of Lerna's algorithm, it validates that the next version does not yet exist.
 * Unfortunately Lerna itself doesn't support this
 */
import * as core from '@actions/core';

import summary from '../lerna-publish-summary.json' with { type: 'json' };

try {
  determineNextCanaryVersion();
} catch (err) {
  core.error(err);
  process.exitCode = 1;
}

function determineNextCanaryVersion() {
  const npmVersion = summary.find((pkg) => pkg.version)?.version.replace(/^v/, '');
  if (!npmVersion) {
    throw new Error('Could not determine npm canary version from lerna publish summary');
  }
  core.setOutput('npm-package-version', npmVersion);
  core.info(npmVersion);
  core.notice(`Next canary version is ${npmVersion}`);
}
