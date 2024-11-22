import { test, expect } from '@playwright/test';
import { URL } from 'url';
import type { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import { simpleReportV1, simpleReportV2 } from '../actions/report.action.js';
import { ReportClient } from '../po/reports/report-client.po.js';

test.describe('Report api', () => {
  let client: ReportClient;

  test.beforeEach(({ request }) => {
    client = new ReportClient(request);
  });

  test.afterAll(async () => {
    await client.disableRepository('github.com/stryker-mutator-test-organization/hello-org');
  });

  test.describe('HTTP put', () => {
    test('should respond with the correct href', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReportV1('github.com/stryker-mutator-test-organization/hello-org', 'feat/report'),
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report',
          baseURL,
        ).toString(),
      };
      expect(response).toEqual(expectedResponse);
    });

    test('should accept v2 reports', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReportV2('github.com/stryker-mutator-test-organization/hello-org', 'feat/report', 'module'),
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=module',
          baseURL,
        ).toString(),
        projectHref: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report',
          baseURL,
        ).toString(),
      };
      expect(response).toEqual(expectedResponse);
    });

    test('should respond the correct href and project href when uploading for a module', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReportV1('github.com/stryker-mutator-test-organization/hello-org', 'feat/report', 'fooModule'),
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=fooModule',
          baseURL,
        ).toString(),
        projectHref: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report',
          baseURL,
        ).toString(),
      };
      expect(response).toEqual(expectedResponse);
    });
  });
});
