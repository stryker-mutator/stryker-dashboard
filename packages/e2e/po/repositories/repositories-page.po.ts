import { RepositoriesListPageObject } from './repositories-list.po.js';
import { RepositoryModalDialogPageObject } from './repository-modal-dialog.po.js';
import { SelectPageObject } from '../shared/select.po.js';
import { DashboardPage } from '../shared/dashboard-page.po.js';

export class RepositoriesPage extends DashboardPage {
  public readonly repositoryList = new RepositoriesListPageObject(
    this.page.locator('stryker-repository-list'),
  );
  public readonly modalDialog = new RepositoryModalDialogPageObject(
    this.page.locator('ngb-modal-window'),
  );
  public readonly ownerSelector = new SelectPageObject(this.page.locator('stryker-owner-selector'));

  public async navigate() {
    await this.page.goto('/repos/strykermutator-test-account');
  }
}
