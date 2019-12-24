import { ElementFinder, promise } from 'protractor';

export abstract class PageObject {
  constructor(protected host: ElementFinder) { }

  public isDisplayed(): promise.Promise<boolean> {
    return this.host.isDisplayed();
  }
}
