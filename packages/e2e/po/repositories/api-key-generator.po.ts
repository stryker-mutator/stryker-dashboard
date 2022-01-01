import { PageObject } from '../shared/page-object';

export class ApiKeyGeneratorPageObject extends PageObject {

  public async apiKey(): Promise<string> {
    return (await this.host.$('[data-test="api-key"]'))!.innerText();
  }

  public async generateNew(): Promise<void> {
    return (await this.host.$('#generateNewButton'))!.click();
  }
}
