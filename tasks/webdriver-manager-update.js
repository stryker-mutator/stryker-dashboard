const { execSync } = require('child_process');
// See https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions#ubuntu-1804-lts
//  and https://sites.google.com/a/chromium.org/chromedriver/
const chromeDriverVersionBuildServer = '77.0.3865.40';
if (process.env.GITHUB_ACTION) {
  console.info('Detecting build server, downloading', chromeDriverVersionBuildServer)
  execSync(`npx webdriver-manager update --versions.chrome ${chromeDriverVersionBuildServer}`, { stdio: 'inherit'});
} else {
  execSync('npx webdriver-manager update', { stdio: 'inherit'});
}