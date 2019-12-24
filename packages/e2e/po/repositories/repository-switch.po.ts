import { ElementFinder, promise } from 'protractor';
import { MutationScoreBadgePageObject } from './mutation-score-badge.po';

export class RepositorySwitchPageObject {
  constructor(private readonly host: ElementFinder) { }

  public async name(): Promise<string> {
    return this.host.$('.repo-slug').getText();
  }

  public get mutationScoreBadge() {
    return new MutationScoreBadgePageObject(this.host.$('stryker-mutation-score-badge'));
  }

  private get checkbox() {
    return this.host.$('input[type=checkbox]');
  }

  private get switch() {
    return this.host.$('label');
  }

  public display(): promise.Promise<void> {
    return this.host.$('button.btn-link').click();
  }

  public async isEnabled(): Promise<boolean> {
    const checked = await this.checkbox.getAttribute('checked');
    return !!checked;
  }

  public async flipSwitch() {
    await this.switch.click();
  }
}
