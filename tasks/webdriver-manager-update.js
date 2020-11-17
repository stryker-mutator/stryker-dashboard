const { execSync } = require('child_process');
// See https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions#ubuntu-1804-lts
if (process.env.CHROMEWEBDRIVER) {
  execSync(`sudo chmod +x ${process.env.CHROMEWEBDRIVER}`, { stdio: 'inherit'})
  console.info('Detecting build server, using ', process.env.CHROMEWEBDRIVER)
} else {
  execSync('npx webdriver-manager update', { stdio: 'inherit'});
}