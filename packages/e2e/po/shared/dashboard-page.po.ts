import { Page } from "@playwright/test";

export abstract class DashboardPage {
  constructor(protected page: Page) {}

  
  async waitForAngular() {
    await this.page.evaluate(async () => {
      // @ts-expect-error
      if (window.getAllAngularTestabilities) {
        // @ts-expect-error
        await Promise.all(window.getAllAngularTestabilities().map(whenStable));
        // @ts-expect-error
        async function whenStable(testability) {
          return new Promise((res) => testability.whenStable(res) );
        }
      }
     });
   }
}
