import { PageObject } from '../shared/page-object';
import { MutationScoreBadgePageObject } from './mutation-score-badge.po';

export class RepositorySwitchPageObject extends PageObject {
  public readonly checkbox = this.host.locator('input[type=checkbox]');
  private readonly switch = this.host.locator('label');
  public readonly mutationScoreBadge = new MutationScoreBadgePageObject(
    this.host.locator('stryker-mutation-score-badge')
  );

  public async name(): Promise<string> {
    const slug = this.host.locator('.repo-slug');
    return slug!.innerText();
  }

  public async display() {
    await this.host.locator('button.btn-link').click();
  }

  public async flipSwitch() {
    await this.switch.click();
  }
}
