import { RepositoriesListPageObject } from "./repositories-list.po";
import { RepositoryModalDialogPageObject } from "./repository-modal-dialog.po";
import { OwnerSelectorPageObject } from "./owner-selector.po";
import { DashboardPage } from "../shared/dashboard-page.po";

export class RepositoriesPage extends DashboardPage {
  public async navigate() {
    await this.page.goto("/repos");
    await this.waitForAngular();
  }

  public async repositoryList() {
    return new RepositoriesListPageObject(
      await this.page.$("stryker-repository-list")
    );
  }

  public async modalDialog() {
    const modalElement = await this.page.$("ngb-modal-window");
    if (modalElement) {
      return new RepositoryModalDialogPageObject(modalElement);
    } else {
      return null;
    }
  }

  public async ownerSelector() {
    return new OwnerSelectorPageObject(
      await this.page.$("stryker-owner-selector")
    );
  }
}
