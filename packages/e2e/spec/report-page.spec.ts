import { ReportPage } from '../po/reports/report-page.po';
import { expect } from 'chai';
import { uploadReport, simpleReport } from '../actions/report.action';

describe('Report page', () => {
  let page: ReportPage;

  before(() => {
    page = new ReportPage();
  });

  describe('when report does not exist', () => {
    before(async () => {
      await page.navigate('a/b/c', 'd');
    });

    it('should show an error message', async () => {
      expect(await page.errorMessage()).eq('Report does not exist');
    });
  });

  describe('when a report exists', async () => {
    before(async () => {
      await uploadReport('github.com/stryker-mutator-test-organization/hello-org', 'master', simpleReport());
      await page.navigate('github.com/stryker-mutator-test-organization/hello-org', 'master');
    });

    it('should show the mutation-test-report-app with bound data', async () => {
      const actualTitle = await page.mutationTestReportApp.title();
      const mutationScore = await page.mutationTestReportApp.mutationScore();
      expect(actualTitle).eq('All files - hello-org/master - Stryker Dashboard');
      expect(mutationScore).eq(33.33);
    });
  });
});
