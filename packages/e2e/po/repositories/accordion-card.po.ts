import { PageObject } from '../shared/page-object.js';

export class AccordionCardPageObject extends PageObject {
  public readonly body = this.host.locator('.accordion-body');
  public readonly header = this.host.locator('.accordion-header');

  public async activate(): Promise<void> {
    await this.host.locator('.accordion-header button').click();
  }
}
