import { PageObject } from "../shared/page-object";

export class MutationScoreBadgePageObject extends PageObject {
  public async waitForLink(): Promise<void> {
    const anchor = await this.host.$("a");
    await anchor!.waitForElementState('visible')
  }

  public async linkHref(): Promise<string | null> {
    return (await this.host.$("a"))!.getAttribute("href");
  }

  public async imgSrc(): Promise<string | null> {
    return (await this.host.$("img"))!.getAttribute("src");
  }
}
