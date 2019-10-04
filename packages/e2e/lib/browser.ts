import { Capabilities, Builder, WebDriver } from 'selenium-webdriver';

let browser: WebDriver | null = null;

export async function init() {
  const headlessCapabilities = Capabilities.chrome();
  if (process.env.GITHUB_WORKFLOW) {
    console.log('Detecting buildserver. Using headless chrome');
    headlessCapabilities.set('chromeOptions', { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  }
  browser = await new Builder()
    .forBrowser('chrome')
    .withCapabilities(headlessCapabilities)
    .build();
}

export function getCurrent(): WebDriver {
  if (!browser) {
    throw new Error('Browser is not yet initialized');
  }
  return browser;
}
