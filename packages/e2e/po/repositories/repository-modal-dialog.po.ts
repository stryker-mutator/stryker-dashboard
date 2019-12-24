import { PageObject } from '../shared/page-object';
import { promise } from 'protractor';
import { AccordionPageObject } from './accordion.po';
import { ApiKeyGeneratorPageObject } from './api-key-generator.po';

export class RepositoryModalDialogPageObject extends PageObject {

  private get closeButton() {
    return this.host.$('button.close');
  }

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

  public close(): promise.Promise<void> {
    return this.closeButton.click();
  }

  public get apiKeyGenerator() {
    return new ApiKeyGeneratorPageObject(this.host.$('stryker-api-key-generator'));
  }

}
