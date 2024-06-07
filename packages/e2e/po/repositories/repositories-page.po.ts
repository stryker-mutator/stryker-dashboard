import { SelectPageObject } from '../shared/select.po.js';
import { DashboardPage } from '../shared/dashboard-page.po.js';
import { getOptionalEnvVariable } from '../../actions/helpers.action.js';

export class RepositoriesPage extends DashboardPage {
  public readonly ownerSelector = new SelectPageObject(this.page.locator('stryker-owner-selector'));

  public async navigate() {
    await this.page.goto(`/repos/${getOptionalEnvVariable('E2E_GITHUB_USER_NAME', 'strykermutator-test-account')}`);
  }
}
