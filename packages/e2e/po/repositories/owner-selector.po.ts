import { PageObject } from '../shared/page-object';

export class OwnerSelectorPageObject extends PageObject {

  private options() {
    return this.host.$$('option');
  }

  public async optionValues(): Promise<(string | null)[]> {
    const options = await this.options();
    return Promise.all(options.map(option => option.getAttribute('value')));
  }

  public async select(optionValue: string): Promise<void> {
    const select = await this.host.$('select');
    await select!.selectOption(optionValue);
  }
}
