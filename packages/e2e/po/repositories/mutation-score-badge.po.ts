import { PageObject } from "../shared/page-object";

export class MutationScoreBadgePageObject extends PageObject {
  public async hasLink(): Promise<boolean> {
    return (await this.host.$("a"))!.isVisible();
  }

  public async linkHref(): Promise<string | null> {
    return (await this.host.$("a"))!.getAttribute("href");
  }

  public async imgSrc(): Promise<string | null> {
    return (await this.host.$("img"))!.getAttribute("src");
  }
}
