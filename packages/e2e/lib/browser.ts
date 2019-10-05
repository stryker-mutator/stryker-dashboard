import { WebDriver, Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

let browser: WebDriver | null = null;

export async function init() {
  const options = new Options().windowSize({
    width: 2000,
    height: 1000
  });
  if (process.env.GITHUB_WORKFLOW) {
    console.log('Detecting build server. Using headless chrome');
    options.headless();
  }
  browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

export function getCurrent(): WebDriver {
  if (!browser) {
    throw new Error('Browser is not yet initialized');
  }
  return browser;
}
