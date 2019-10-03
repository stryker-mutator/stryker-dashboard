/**
 * This file contains an implementation to determine the canary version using lerna's algorithm.
 * Unfortenetly Lerna doesn't export this functionality in a nicer way
 */

const describeRef = require('@lerna/describe-ref');
const semver = require('semver');
describeRef()
  .then(({ lastVersion, refCount }) => console.log(`${semver.inc(lastVersion, 'patch')}-alpha.${refCount}`))
  .catch(err => {
    console.err(err);
    process.exitCode = 1;
  });