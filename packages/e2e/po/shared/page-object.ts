import { expect, Locator } from "@playwright/test";

export abstract class PageObject {
  constructor(public readonly host: Locator) {}

  public async isPresent(): Promise<boolean> {
    const element = await this.host.elementHandle();
    return !!element;
  }

  public async isVisible(): Promise<boolean> {
    return this.host.isVisible();
  }

  static async selectAll<T extends PageObject>(
    host: Locator,
    PageObject: { new (locator: Locator): T },
    expectedCount: number
  ) {
    await expect(host).toHaveCount(expectedCount);
    const objects: T[] = [];
    for (let i = 0; i < expectedCount; i++) {
      objects.push(new PageObject(host.nth(i)));
    }
    return objects;
  }
}
