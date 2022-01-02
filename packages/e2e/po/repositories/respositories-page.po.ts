import { DashboardPage } from '../shared/dashboard-page.po';
import { RepositoriesListPageObject } from './repositories-list.po';
import { RepositoryModalDialogPageObject } from './repository-modal-dialog.po';

export class RepositoriesPage extends DashboardPage {
  public async navigate() {
    await this.page.goto('/repositories');
  }

  public async repositoryList() {
    return new RepositoriesListPageObject(await this.page.$('stryker-repository-list'));
  }

  public async modalDialog() {
    return new RepositoryModalDialogPageObject(await this.page.$('ngb-modal-window'));
  }
}
