import { PageObject } from '../shared/page-object';
import { promise } from 'protractor';

export class ApiKeyGeneratorPageObject extends PageObject {

  public apiKey(): promise.Promise<string> {
    return this.host.$('[data-test="api-key"]').getText();
  }

  public generateNew(): promise.Promise<void> {
    return this.host.$('#generateNewButton').click();
  }
}
