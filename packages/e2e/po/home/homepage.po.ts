import { DashboardPage } from '../shared/dashboard-page.po.js';

export class Homepage extends DashboardPage {
  public readonly hero = this.page.locator('sme-hero');

  public async navigate() {
    return this.page.goto('/');
  }

  public async title() {
    return this.page.title();
  }
}
