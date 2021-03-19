const { execSync } = require('child_process');
const path = require('path');
// See https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions#ubuntu-1804-lts
if (process.env.CHROMEWEBDRIVER) {
  console.info(`[${path.basename(__filename)}] Detecting build server, using ${process.env.CHROMEWEBDRIVER}/chromedriver`)
} else {
  execSync('npx webdriver-manager update', { stdio: 'inherit'});
}