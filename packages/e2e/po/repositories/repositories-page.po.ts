import { SelectPageObject } from '../shared/select.po.js';
import { DashboardPage } from '../shared/dashboard-page.po.js';

export class RepositoriesPage extends DashboardPage {
  public readonly ownerSelector = new SelectPageObject(this.page.locator('stryker-owner-selector'));

  public async navigate() {
    await this.page.goto('/repos/strykermutator-test-account');
  }
}
