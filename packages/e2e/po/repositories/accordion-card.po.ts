import { PageObject } from "../shared/page-object";

export class AccordionCardPageObject extends PageObject {
  public readonly body = this.host.locator(".card-body");
  public readonly header = this.host.locator(".card-header");
  
  public async activate(): Promise<void> {
    await this.host.locator(".card-header button").click();
  }
}
