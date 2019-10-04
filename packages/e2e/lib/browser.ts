import { Capabilities, Builder, WebDriver } from 'selenium-webdriver';

let browser: WebDriver | null = null;

export async function init() {
  const headlessCapabilities = Capabilities.chrome();
  if (process.env.GITHUB_WORKFLOW) {
    // Use headless chrome on the build server
    headlessCapabilities.set('chromeOptions', { args: ['--headless'] });
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
