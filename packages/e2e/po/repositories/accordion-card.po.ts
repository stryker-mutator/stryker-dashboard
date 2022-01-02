import { PageObject } from '../shared/page-object';

export class AccordionCardPageObject extends PageObject {

  public async activate(): Promise<void> {
    const card = await this.host.$('.card-header button');
    return card!.click();
  }

  private async body() {
    return this.host.$('.card-body');
  }

  public async headerText() {
    return (await this.header())!.innerText();
  }

  public async bodyText() {
    return (await this.body())!.innerText();
  }

  private header() {
    return this.host.$('.card-header');
  }

  public async isBodyVisible(): Promise<boolean> {
    const body = await this.body();
    if (body) {
      return body.isVisible();
    } else {
      return false;
    }
  }

}
