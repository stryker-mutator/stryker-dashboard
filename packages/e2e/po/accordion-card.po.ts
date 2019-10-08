import { PageObject } from './PageObject';
import { promise } from 'protractor';

export class AccordionCardPageObject extends PageObject {

  public activate(): promise.Promise<void> {
    return this.host.$('.card-header button').click();
  }

  private get body() {
    return this.host.$('.card-body');
  }

  public get headerText() {
    return this.header.getText();
  }

  public get bodyText() {
    return this.body.getText();
  }

  private get header() {
    return this.host.$('.card-header');
  }

  public async isBodyVisible(): Promise<boolean> {
    const isPresent = await this.body.isPresent();
    if (isPresent) {
      return this.body.isDisplayed();
    } else {
      return false;
    }
  }

}
