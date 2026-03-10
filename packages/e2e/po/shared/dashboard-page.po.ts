import type { Page } from '@playwright/test';

import { generateAuthToken } from '../../actions/auth.action.js';

export abstract class DashboardPage {
  public readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

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
}
