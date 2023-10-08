import { test, expect } from '@playwright/test';
import { ReportClient } from '../po/reports/report-client.po.js';
import { pendingReport } from '../actions/report.action.js';
import type { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import type { Report } from '@stryker-mutator/dashboard-common';
import { MutantStatus } from 'mutation-testing-report-schema';

test.describe('Real-time api', () => {
  let client: ReportClient;
  let report: Report;

  test.beforeEach(({ request }) => {
    client = new ReportClient(request);
    report = createPendingReport();
  });

  test.afterEach(async () => {
    await client.deletePendingReport(report);
  });

  test.describe('HTTP PUT', () => {
    test('should accept pending reports', async ({ baseURL }) => {
      const response = await uploadPendingReport(report);
      const expectedResponse: PutReportResponse = {
        href: new URL(
          'reports/github.com/stryker-mutator-test-organization/hello-org/main?realTime=true',
          baseURL
        ).toString(),
        projectHref: new URL(
          'reports/github.com/stryker-mutator-test-organization/hello-org/main',
          baseURL
        ).toString(),
      };

      expect(response).toEqual(expectedResponse);
    });
  });

  test.describe('HTTP POST', () => {
    test('should accept a batch of mutants', async () => {
      await uploadPendingReport(report);

      const response = await client.postMutantBatch(report, [
        { id: '1', status: MutantStatus.Killed },
        { id: '2', status: MutantStatus.Killed },
        { id: '3', status: MutantStatus.Killed },
      ]);
      expect(response.status()).toBe(400);
    })

    test('should not accept a batch of mutants if they do not comply with schema', async () => {
      await uploadPendingReport(report);

      const response = await client.postMutantBatch(report, [
        { id: '1', },
      ]);
      expect(response.status()).toBe(400);
    });
  });

  function createPendingReport(): Report {
    return pendingReport(
      'github.com/stryker-mutator-test-organization/hello-org',
      'main'
    );
  }

  async function uploadPendingReport(
    report: Report
  ): Promise<PutReportResponse> {
    return await client.uploadPendingReport(report);
  }
});
