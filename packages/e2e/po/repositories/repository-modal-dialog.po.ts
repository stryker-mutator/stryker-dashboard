import { PageObject } from '../shared/page-object';
import { promise } from 'protractor';
import { AccordionPageObject } from './accordion.po';

export class RepositoryModalDialogPageObject extends PageObject {

  public title(): promise.Promise<string> {
    return this.host.$('h2').getText();
  }

  public get accordion() {
    return new AccordionPageObject(this.host.$('ngb-accordion'));
  }

  public async isVisible(): Promise<boolean> {
    const isPresent = await this.host.isPresent();
    if (isPresent) {
      return this.host.isDisplayed();
    } else {
      return isPresent;
    }
  }

  public apiKey(): promise.Promise<string> {
    return this.host.$('[data-test="api-key"]').getText();
  }

}
