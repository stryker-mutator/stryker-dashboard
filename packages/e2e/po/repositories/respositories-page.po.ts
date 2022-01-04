import { DashboardPage } from "../shared/dashboard-page.po";
import { RepositoriesListPageObject } from "./repositories-list.po";
import { RepositoryModalDialogPageObject } from "./repository-modal-dialog.po";

export class RepositoriesPage extends DashboardPage {
  public readonly repositoryList = new RepositoriesListPageObject(
    this.page.locator("stryker-repository-list")
  );
  public readonly modalDialog = new RepositoryModalDialogPageObject(
    this.page.locator("ngb-modal-window")
  );

  public async navigate() {
    await this.page.goto("/repositories");
  }
}
