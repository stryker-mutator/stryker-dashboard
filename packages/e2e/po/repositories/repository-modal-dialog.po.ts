import { PageObject } from '../shared/page-object';
import { AccordionPageObject } from './accordion.po';
import { ApiKeyGeneratorPageObject } from './api-key-generator.po';

export class RepositoryModalDialogPageObject extends PageObject {

  private closeButton() {
    return this.host.$('button.close');
  }

  public async title(): Promise<string> {
    const h2 = await this.host.$('h2');
    return h2!.innerText();
  }

  public async accordion() {
    return new AccordionPageObject(await this.host.$('ngb-accordion'));
  }

  public async close(): Promise<void> {
    return (await this.closeButton())!.click();
  }

  public async apiKeyGenerator() {
    return new ApiKeyGeneratorPageObject(await this.host.$('stryker-api-key-generator'));
  }

}
