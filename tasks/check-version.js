
/**
 * This task checks if the version of the badge-api or dashboard is correct according to the expectation.
 */

const path = require('path');
const { expect, config } = require('chai');
config.truncateThreshold = 0;

function httpClient() {
  if (url.startsWith('https://')) {
    return require('https').get;
  } else {
    return require('http').get;
  }
}

const [, , type, url, expectedVersion] = process.argv;
console.log(`Validating ${url} for version ${expectedVersion}`);
if (url && expectedVersion && type === 'dashboard' || type === 'badge-api') {
  httpClient()(url, resp => {
    if (type === 'dashboard') {
      verifyDashboardVersion(resp);
    } else {
      expect(resp.headers['x-badge-api-version'], 'Validating x-badge-api-version').eq(expectedVersion);
    }
    console.log(`✅  ${expectedVersion} installed at ${url} ^-^`)
  });
} else {
  console.info(`Usage: node ${path.basename(__filename)} [badge-api/dashboard] url version`);
  console.info(`Example: node ${path.basename(__filename)} dashboard https://dashboard.stryker-mutator.io/api/version 1.0.0\``);
  process.exitCode = 1;
}

function verifyDashboardVersion(resp) {
  let data = '';
  resp.on('data', chunk => data += chunk);
  resp.on('end', () => {
    const versionInfo = JSON.parse(data);
    expect(versionInfo).deep.eq({
      dashboard: expectedVersion,
      frontend: expectedVersion
    });
  });
}