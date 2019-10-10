import { promise, browser, $ } from 'protractor';
import { MutationTestingReportAppPageObject } from './mutation-testing-report-app.po';

export class ReportPage {
  public navigate(repositorySlug: string, version: string): promise.Promise<void> {
    return browser.get(`/reports/${repositorySlug}/${version}`);
  }

  public errorMessage(): promise.Promise<string> {
    return $('.alert-danger').getText();
  }

  public get mutationTestReportApp() {
    return new MutationTestingReportAppPageObject($('mutation-test-report-app'));
  }
}
