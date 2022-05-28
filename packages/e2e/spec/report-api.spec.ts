import { test, expect } from '@playwright/test';
import { simpleReport } from '../actions/report.action';
import { URL } from 'url';
import { PutReportResponse } from '@stryker-mutator/dashboard-contract/src';
import { ReportClient } from '../po/reports/report-client.po';

test.describe('Report api', () => {
  let client: ReportClient;

  test.beforeEach(({ request }) => {
    client = new ReportClient(request);
  });

  test.describe('HTTP put', () => {
    test('should respond with the correct href', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReport(
          'github.com/stryker-mutator-test-organization/hello-org',
          'feat/report'
        )
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report',
          baseURL
        ).toString(),
      };
      expect(response).toEqual(expectedResponse);
    });

    test('should respond the correct href and project href when uploading for a module', async ({
      baseURL,
    }) => {
      const response = await client.uploadReport(
        simpleReport(
          'github.com/stryker-mutator-test-organization/hello-org',
          'feat/report',
          'fooModule'
        )
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=fooModule',
          baseURL
        ).toString(),
        projectHref: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report',
          baseURL
        ).toString(),
      };
      expect(response).toEqual(expectedResponse);
    });
  });
});
