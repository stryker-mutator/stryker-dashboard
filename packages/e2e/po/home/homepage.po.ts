import { DashboardPage } from '../shared/dashboard-page.po';

export class Homepage extends DashboardPage {

  public readonly h1 = this.page.locator('h1');

  public async navigate() {
    return this.page.goto('/');
  }

  public async title() {
    return this.page.title();
  }
}
