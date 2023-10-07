import test, { expect } from '@playwright/test';
import { ReportClient } from '../po/reports/report-client.po';
import { pendingReport } from '../actions/report.action';
import type { PutReportResponse } from '@stryker-mutator/dashboard-contract';
import type { Report } from '@stryker-mutator/dashboard-common';
import { MutantStatus } from 'mutation-testing-report-schema';

test.describe('Real-time api', () => {
  let client: ReportClient;

  test.beforeEach(({ request }) => {
    client = new ReportClient(request);
  });

  test.afterEach(async () => {
    await client.deletePendingReport(createPendingReport());
  });

  test.describe('HTTP PUT', () => {
    test('should accept pending reports', async ({ baseURL }) => {
      const response = await uploadPendingReport(createPendingReport());
      const expectedResponse: PutReportResponse = {
        href: new URL(
          'github.com/stryker-mutator-test-organization/hello-org/main',
          baseURL
        ).toString(),
      };

      expect(response).toEqual(expectedResponse);
    });
  });

  test.describe('HTTP POST', () => {
    test('should accept a batch of mutants', async () => {
      const report = createPendingReport();
      await uploadPendingReport(report);

      const response = await client.postMutantBatch(report, [
        { id: '1', status: MutantStatus.Killed },
      ]);
      expect(response.ok).toBe(true);
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
