import { Page } from "@playwright/test";
import { generateAuthToken } from "../../actions/auth.action";

export abstract class DashboardPage {
  constructor(protected page: Page) {}

  async logOn() {
    const authToken = generateAuthToken();
    await this.page.goto('/');
    await this.page.evaluate(`window.sessionStorage.setItem('authToken', '${authToken}');`);
  }
  
  async logOff() {
    await this.page.evaluate('window.sessionStorage.removeItem("authToken")');
  }

  async close() {
    await this.page.close();
  }
  
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
