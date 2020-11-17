const { execSync } = require('child_process');
// See https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions#ubuntu-1804-lts
if (process.env.CHROMEWEBDRIVER) {
  console.info('Detecting build server, using ', process.env.CHROMEWEBDRIVER)
  execSync(`sudo chown $(id -u):$(id -g)  ${process.env.CHROMEWEBDRIVER}`, { stdio: 'inherit'})
  execSync(`sudo chmod 777 ${process.env.CHROMEWEBDRIVER}`, { stdio: 'inherit'})
  console.info(`sudo chown $(id -u):$(id -g) ${process.env.CHROMEWEBDRIVER}`)
  console.info(`sudo chmod 777 ${process.env.CHROMEWEBDRIVER}`)
} else {
  execSync('npx webdriver-manager update', { stdio: 'inherit'});
}