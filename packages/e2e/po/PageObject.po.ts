import { WebElement, WebDriver } from 'selenium-webdriver';
import { ElementSelector } from '../lib/ElementSelector';

export class PageObject extends ElementSelector {
  constructor(protected readonly host: WebElement, protected readonly browser: WebDriver) {
    super(host);
  }
}
