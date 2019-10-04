import { ElementSelector } from '../lib/ElementSelector';
import { WebDriver } from 'selenium-webdriver';

export class HomePage extends ElementSelector {

  constructor(private readonly browser: WebDriver) {
    super(browser);
  }

  get slogan() {
    return this.$('h1').getText();
  }

  public async navigate() {
    return this.browser.get(`${process.env.BASE_URL}/`);
  }

  get title() {
    return this.browser.getTitle();
  }
}
