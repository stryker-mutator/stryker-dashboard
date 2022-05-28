import { DashboardPage } from '../shared/dashboard-page.po.js';
import { MutationTestingReportAppPageObject } from './mutation-testing-report-app.po.js';

export class ReportPage extends DashboardPage {
  public async navigate(
    repositorySlug: string,
    version: string
  ): Promise<void> {
    await this.page.goto(`/reports/${repositorySlug}/${version}`);
  }

  public errorAlert = this.page.locator('.alert-danger');
  public warningAlert = this.page.locator('.alert-warning');
  public mutationTestReportApp = new MutationTestingReportAppPageObject(
    this.page.locator('mutation-test-report-app')
  );
  public mutationScore = this.page.locator('.stryker-mutation-score');
}
