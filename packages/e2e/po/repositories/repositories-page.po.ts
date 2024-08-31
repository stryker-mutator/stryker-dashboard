import { DashboardPage } from '../shared/dashboard-page.po.js';
import { getOptionalEnvVariable } from '../../actions/helpers.action.js';

export class RepositoriesPage extends DashboardPage {
  public disabledRepositories = this.page.locator(
    'sme-list#disabled-repositories > sme-toggle-repository',
  );
  public enabledRepositories = this.page.locator(
    'sme-list#enabled-repositories > sme-toggle-repository',
  );

  public async navigate() {
    await this.page.goto(
      `/repos/${getOptionalEnvVariable('E2E_GITHUB_USER_NAME', 'strykermutator-test-account')}`,
    );
  }
}
