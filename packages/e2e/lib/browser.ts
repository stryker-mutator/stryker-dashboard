import { WebDriver, Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

let browser: WebDriver | null = null;

export async function init() {

  browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().headless().windowSize({
      width: 640,
      height: 480
    }))
    .build();

  // const headlessCapabilities = Capabilities.chrome();
  // // if (process.env.GITHUB_WORKFLOW) {
  // console.log('Detecting buildserver. Using headless chrome');
  // // headlessCapabilities.set()
  // headlessCapabilities.set('chromeOptions', { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
  // // }
  // const chromeService = new ServiceBuilder().build();
  // browser = await Driver.createSession(headlessCapabilities, chromeService);
}

export function getCurrent(): WebDriver {
  if (!browser) {
    throw new Error('Browser is not yet initialized');
  }
  return browser;
}
