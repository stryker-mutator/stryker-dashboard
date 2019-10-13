/**
 * This file contains an implementation to determine the canary version using Lerna's algorithm.
 * Unfortenetly Lerna doesn't export this functionality in a nicer way.
 */
const describeRef = require('@lerna/describe-ref');
const semver = require('semver');
const core = require('@actions/core');

const ref = determineRef();
const preId = sanitize(ref);
console.log(`PreId: ${preId}`);
describeRef()
  .then(({ lastVersion, refCount }) => {
    const npmVersion = `${semver.inc(lastVersion, 'patch')}-${preId}.${Math.max(0, refCount - 1)}`;
    core.exportVariable('NPM_PACKAGE_VERSION', npmVersion);
    console.log(npmVersion);
  })
  .catch(err => {
    console.err(err);
    process.exitCode = 1;
  });

/**
 * @param {string} ref 
 */
function sanitize(ref) {
  // Sanitizes a github ref name to be a valid pre-id according to semver spec: https://semver.org/#spec-item-9
  return ref.replace(/\//g, '-');
}

function determineRef() {
  const rawRef = process.env.GITHUB_REF;
  console.log(`Raw ref: ${rawRef}`);
  // Ref will be in the form "refs/pull/:prNumber/merge" or "refs/heads/feat/branch-1"
  const [, type, ...name] = rawRef.split('/');
  if (type === 'pull') {
    return `pr-${name[0]}`
  } else {
    return name.join('/');
  }
}