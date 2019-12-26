import { simpleReport, uploadReport } from '../actions/report.action';
import { expect } from 'chai';
import { URL } from 'url';
import { browser } from 'protractor';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract/src';

const baseUrl = browser.baseUrl;

describe('Report api', () => {
  describe('HTTP put', () => {
    it('should respond with the correct href', async () => {
      const response = await uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/report'));

      const expectedResponse: PutReportResponse = {
        href: new URL('/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report', baseUrl).toString()
      };
      expect(response).deep.eq(expectedResponse);
    });

    it('should respond the correct href and project href when uploading for a module', async () => {
      const response = await uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/report', 'fooModule'));

      const expectedResponse: PutReportResponse = {
        href: new URL('/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=fooModule', baseUrl).toString(),
        projectHref: new URL('/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report', baseUrl).toString()
      };
      expect(response).deep.eq(expectedResponse);
    });
  });
});
