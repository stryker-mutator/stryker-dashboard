import { ElementFinder } from 'protractor';

export class RepositorySwitchPageObject {
  constructor(private readonly host: ElementFinder) { }

  public async name(): Promise<string> {
    return this.host.$('.repo-slug').getText();
  }

  private get checkbox() {
    return this.host.$('input[type=checkbox]');
  }

  private get switch() {
    return this.host.$('label');
  }

  public async isEnabled(): Promise<boolean> {
    const checked = await this.checkbox.getAttribute('checked');
    return !!checked;
  }

  public async flipSwitch() {
    await this.switch.click();
  }
}
