import { PageObject } from '../shared/page-object';
import { ElementFinder, browser } from 'protractor';

export class OwnerSelectorPageObject extends PageObject {

  private get options() {
    return this.host.$$('option');
  }

  public async optionValues(): Promise<string[]> {
    const options: ElementFinder[] = await this.options;
    return Promise.all(options.map(option => option.getAttribute('value')));
  }

  public async select(optionValue: string): Promise<void> {
    await this.host.click();
    // Give browser time to reveal the dropdown
    await browser.sleep(500);
    await this.host.$(`option[value=${optionValue}]`).click();
  }
}
