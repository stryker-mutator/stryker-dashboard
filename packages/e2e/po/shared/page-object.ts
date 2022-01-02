import { ElementHandle } from "@playwright/test";

export abstract class PageObject {
  protected host: ElementHandle;

  constructor(host: ElementHandle | null | undefined) {
    if (!host) {
      throw new Error("Element doesn't exist");
    }
    this.host = host;
  }

  public async isVisible(): Promise<boolean> {
    return this.host.isVisible();
  }
}
