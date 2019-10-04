import { Locator, WebElement, WebElementPromise } from 'selenium-webdriver';

export interface ElementFinder {
  findElements(locator: Locator): PromiseLike<WebElement[]>;
  findElement(locator: Locator): WebElementPromise;
  getTagName?(): PromiseLike<string>;
}
