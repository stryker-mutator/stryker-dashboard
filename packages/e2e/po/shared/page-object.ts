import { expect, type Locator } from '@playwright/test';

export abstract class PageObject {
  public readonly host: Locator;
  constructor(host: Locator) {
    this.host = host;
  }

  public async isPresent(): Promise<boolean> {
    const element = await this.host.elementHandle();
    return !!element;
  }

  public async isVisible(): Promise<boolean> {
    return this.host.isVisible();
  }

  static async selectAll<T extends PageObject>(
    host: Locator,
    PageObject: new (locator: Locator) => T,
    expectedCount: number,
  ) {
    await expect(host).toHaveCount(expectedCount);
    const objects: T[] = [];
    for (let i = 0; i < expectedCount; i++) {
      objects.push(new PageObject(host.nth(i)));
    }
    return objects;
  }
}
