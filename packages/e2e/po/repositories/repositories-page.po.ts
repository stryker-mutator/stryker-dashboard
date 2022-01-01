import { RepositoriesListPageObject } from "./repositories-list.po";
import { RepositoryModalDialogPageObject } from "./repository-modal-dialog.po";
import { OwnerSelectorPageObject } from "./owner-selector.po";
import { DashboardPage } from "../shared/dashboard-page.po";

export class RepositoriesPage extends DashboardPage {
  public async navigate() {
    return this.page.goto("/repos");
  }

  public async repositoryList() {
    return new RepositoriesListPageObject(
      await this.page.$("stryker-repository-list")
    );
  }

  public async modalDialog() {
    return new RepositoryModalDialogPageObject(
      await this.page.$("ngb-modal-window")
    );
  }

  public async ownerSelector() {
    return new OwnerSelectorPageObject(
      await this.page.$("stryker-owner-selector")
    );
  }
}
