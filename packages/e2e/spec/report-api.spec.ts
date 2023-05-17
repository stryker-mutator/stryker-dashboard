import { test, expect } from '@playwright/test';
import { URL } from 'url';
import type { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import { simpleReportv1, simpleReportv2 } from '../actions/report.action.js';
import { ReportClient } from '../po/reports/report-client.po.js';
import { MutantStatus } from 'mutation-testing-report-schema';

test.describe('Report api', () => {
  let client: ReportClient;

  test.beforeEach(({ request }) => {
    client = new ReportClient(request);
  });

  test.describe('HTTP put', () => {
    test('should respond with the correct href', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReportv1(
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

    test('should accept v2 reports', async ({ baseURL }) => {
      const response = await client.uploadReport(
        simpleReportv2(
          'github.com/stryker-mutator-test-organization/hello-org?realtime=true',
          'feat/report',
          'module',
          [MutantStatus.Pending]
        )
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          '/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=module',
          baseURL
        ).toString(),
        projectHref: new URL(
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
        simpleReportv1(
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
