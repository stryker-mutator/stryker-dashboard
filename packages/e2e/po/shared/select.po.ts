import { Locator } from '@playwright/test';
import { PageObject } from './page-object';

export class SelectPageObject extends PageObject {

  public options(): Locator {
    return this.host.locator('option');
  }

  public async select(optionValue: string): Promise<void> {
    const select = this.host.locator('select');
    await select.selectOption(optionValue);
  }
}
