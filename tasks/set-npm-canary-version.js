/**
 * This file contains an implementation to determine the canary version using lerna's algorithm.
 * Unfortenetly Lerna doesn't export this functionality in a nicer way.
 */
const describeRef = require('@lerna/describe-ref');
const semver = require('semver');
const core = require('@actions/core');
describeRef()
  .then(({ lastVersion, refCount }) => {
    const npmVersion = `${semver.inc(lastVersion, 'patch')}-alpha.${refCount - 1}`;
    core.exportVariable('NPM_PACKAGE_VERSION', npmVersion);
    console.log(npmVersion);
  })
  .catch(err => {
    console.err(err);
    process.exitCode = 1;
  });