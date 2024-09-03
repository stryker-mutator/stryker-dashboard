import { DashboardPage } from '../shared/dashboard-page.po.js';
import { MutationTestingReportAppPageObject } from './mutation-testing-report-app.po.js';

export class ReportPage extends DashboardPage {
  public async navigate(repositorySlug: string, version: string): Promise<void> {
    await this.page.goto(`/reports/${repositorySlug}/${version}`);
  }

  public errorAlert = this.page.locator('sme-notify');
  public warningAlert = this.page.locator('sme-notify');
  public mutationTestReportApp = new MutationTestingReportAppPageObject(this.page.locator('mutation-test-report-app'));
  public mutationScore = this.page.locator('sme-text');
}
