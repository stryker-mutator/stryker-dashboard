import { DashboardPage } from '../shared/dashboard-page.po.js';

export class RepositoriesPage extends DashboardPage {
  public async navigate() {
    await this.page.goto('/repositories');
  }
}
