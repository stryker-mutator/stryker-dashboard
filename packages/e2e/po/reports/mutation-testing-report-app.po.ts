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

  public async title(): Promise<string> {
    const shadowRoot = await this.shadowRoot();
    return shadowRoot.findElement(by.css('h1')).getText();
  }

  public async mutationScore(): Promise<number> {
    const shadowRoot = await this.shadowRoot();
    const totals = await findShadowRoot(shadowRoot.findElement(by.css('mutation-test-report-totals')));
    const percentage = await totals.findElement(by.css('tbody th')).getText();
    return Number.parseFloat(percentage);
  }
}
