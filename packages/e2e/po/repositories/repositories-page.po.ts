import { RepositoriesListPageObject } from "./repositories-list.po";
import { RepositoryModalDialogPageObject } from "./repository-modal-dialog.po";
import { SelectPageObject } from "../shared/select.po";
import { DashboardPage } from "../shared/dashboard-page.po";

export class RepositoriesPage extends DashboardPage {
  public readonly repositoryList = new RepositoriesListPageObject(
    this.page.locator("stryker-repository-list")
  );
  public readonly modalDialog = new RepositoryModalDialogPageObject(
    this.page.locator("ngb-modal-window")
  );
  public readonly ownerSelector = new SelectPageObject(
    this.page.locator("stryker-owner-selector")
  );
  
  public async navigate() {
    await this.page.goto("/repos");
  }
}
