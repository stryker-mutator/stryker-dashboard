import { ElementFinder } from './ElementFinder';
import { WebElement, By, WebElementPromise } from 'selenium-webdriver';

export class ElementSelector {
  constructor(private readonly context: ElementFinder) { }

  public async $$(cssSelector: string): Promise<WebElement[]> {
    return this.context.findElements(By.css(cssSelector));
  }

  public $(cssSelector: string): WebElementPromise {
    return this.context.findElement(By.css(cssSelector));
  }

}
