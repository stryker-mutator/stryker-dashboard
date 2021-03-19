
import { Config } from 'protractor';

const chromeOptions = {
  args: ['--window-size=800x600']
};

if (process.env.CI) {
  console.log('Running on the build server, Enabling headless mode.');
  chromeOptions.args.push('--headless', '--disable-gpu');
}

export let config: Config = {
  framework: 'mocha',
  capabilities: {
    browserName: 'chrome',
    chromeOptions
  },
  mochaOpts: {
    timeout: 99999999
  },
  specs: ['spec/**/*.js'],
  directConnect: true,
  chromeDriver: process.env.CHROMEWEBDRIVER ? `${process.env.CHROMEWEBDRIVER}/chromedriver` : undefined,
  baseUrl: 'https://stryker-dashboard-acceptance.azurewebsites.net'
};
