import { ReportPage } from '../po/reports/report-page.po';
import { expect } from 'chai';
import { uploadReport, simpleReport, scoreOnlyReport } from '../actions/report.action';
import { MutantStatus } from 'mutation-testing-report-schema';

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

  describe('when a full report exists', async () => {
    before(async () => {
      await uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'master'));
      await page.navigate('github.com/stryker-mutator-test-organization/hello-org', 'master');
    });

    // Skip, because protractor doesn't allow shadow dom https://github.com/angular/protractor/pull/4786
    it.skip('should show the mutation-test-report-app with bound data', async () => {
      const actualTitle = await page.mutationTestReportApp.title();
      const mutationScore = await page.mutationTestReportApp.mutationScore();
      expect(actualTitle).eq('All files - hello-org/master - Stryker Dashboard');
      expect(mutationScore).eq(33.33);
    });

    describe('and afterwards it is overridden with a score-only report', async () => {
      before(async () => {
        await uploadReport(scoreOnlyReport('github.com/stryker-mutator-test-organization/hello-org', 'master', 42));
        await page.navigate('github.com/stryker-mutator-test-organization/hello-org', 'master');
      });

      it('should show the mutation score only', async () => {
        expect(await page.warningMessage()).eq('No html report stored for github.com/stryker-mutator-test-organization/hello-org/master');
        expect(await page.mutationTestReportApp.isVisible()).false;
        expect(await page.mutationScoreText()).eq('Mutation score: 42');
      });
    });
  });

  describe('when multiple reports with module names are updated for one project', () => {
    before(async () => {
      await Promise.all([
        uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/modules', 'one', [MutantStatus.Killed, MutantStatus.Killed, MutantStatus.Killed])),
        uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/modules', 'two', [MutantStatus.Survived, MutantStatus.Survived, MutantStatus.Survived])),
        uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/modules', 'three', [MutantStatus.Killed, MutantStatus.Timeout, MutantStatus.NoCoverage])),
      ]);
      await page.navigate('github.com/stryker-mutator-test-organization/hello-org', 'feat/modules');
    });

    // Skip, because protractor doesn't allow shadow dom https://github.com/angular/protractor/pull/4786
    it.skip('should show the aggregated report for the project', async () => {
      const actualTitle = await page.mutationTestReportApp.title();
      const mutationScore = await page.mutationTestReportApp.mutationScore();
      const fileNames = await page.mutationTestReportApp.fileNames();
      expect(actualTitle).eq('All files - hello-org/feat/modules - Stryker Dashboard');
      expect(mutationScore).eq(55.56);
      expect(fileNames).deep.eq(['one/test.js', 'three/test.js', 'two/test.js']);
    });

  });
});
