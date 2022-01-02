import { DashboardPage } from "../shared/dashboard-page.po";
import { MutationTestingReportAppPageObject } from "./mutation-testing-report-app.po";

export class ReportPage extends DashboardPage {
  public async navigate(
    repositorySlug: string,
    version: string
  ): Promise<void> {
    await this.page.goto(`/reports/${repositorySlug}/${version}`);
    await this.waitForAngular();
  }

  public async errorMessage(): Promise<string> {
    const alert = await this.page.$(".alert-danger");
    return alert!.innerText();
  }

  public async warningMessage(): Promise<string> {
    const alert = await this.page.$(".alert-warning");
    return alert!.innerText();
  }

  public async mutationScoreText(): Promise<string> {
    return (await this.page.$(".stryker-mutation-score"))!.innerText();
  }

  public async mutationTestReportApp() {
    const mteElement = await this.page.$("mutation-test-report-app");
    if (mteElement) {
      return new MutationTestingReportAppPageObject(mteElement);
    } else {
      return null;
    }
  }
}
