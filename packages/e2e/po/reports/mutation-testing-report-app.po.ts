import { PageObject } from '../shared/page-object';
import { browser, WebElement, by, ElementFinder, WebElementPromise } from 'protractor';

async function findShadowRoot(element: WebElementPromise | ElementFinder) {
  const host = await element;
  return browser.executeScript<WebElement>('return arguments[0].shadowRoot', host);
}

export class MutationTestingReportAppPageObject extends PageObject {

  private shadowRoot(): Promise<WebElement> {
    return findShadowRoot(this.host);
  }

  private async totalsShadowRoot(): Promise<WebElement> {
    const shadowRoot = await this.shadowRoot();
    return findShadowRoot(shadowRoot.findElement(by.css('mutation-test-report-totals')));
  }

  public async title(): Promise<string> {
    const shadowRoot = await this.shadowRoot();
    return shadowRoot.findElement(by.css('h1')).getText();
  }

  public async mutationScore(): Promise<number> {
    const totals = await this.totalsShadowRoot();
    const percentage = await totals.findElement(by.css('tbody td:nth-child(4)')).getText();
    return Number.parseFloat(percentage);
  }

  public async fileNames(): Promise<string[]> {
    const totals = await this.totalsShadowRoot();
    const files = await totals.findElements(by.css('tbody td a'));
    return Promise.all(files.map(a => a.getText()));
  }

  public async isVisible() {
    const present = await this.host.isPresent();
    if (present) {
      return this.host.isDisplayed();
    } else {
      return present;
    }
  }
}
