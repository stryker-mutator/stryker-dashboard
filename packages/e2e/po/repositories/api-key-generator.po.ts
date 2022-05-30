import { PageObject } from '../shared/page-object.js';

export class ApiKeyGeneratorPageObject extends PageObject {
  public readonly apiKey = this.host.locator('[data-test="api-key"]');

  public async generateNew(): Promise<void> {
    await this.host.locator('#generateNewButton').click();
  }
}
