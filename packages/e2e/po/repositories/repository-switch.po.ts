import { PageObject } from "../shared/page-object";
import { MutationScoreBadgePageObject } from "./mutation-score-badge.po";

export class RepositorySwitchPageObject extends PageObject {
  public async name(): Promise<string> {
    const slug = await this.host.$(".repo-slug");
    return slug!.innerText();
  }

  public async mutationScoreBadge() {
    return new MutationScoreBadgePageObject(
      await this.host.$("stryker-mutation-score-badge")
    );
  }

  private async checkbox() {
    return this.host.$("input[type=checkbox]");
  }

  private async switch() {
    return this.host.$("label");
  }

  public async display(): Promise<void> {
    return (await this.host.$("button.btn-link"))!.click();
  }

  public async isChecked(): Promise<boolean> {
    return (await this.checkbox())!.isChecked();
  }

  public async flipSwitch() {
    await (await this.switch())!.click();
  }
}
