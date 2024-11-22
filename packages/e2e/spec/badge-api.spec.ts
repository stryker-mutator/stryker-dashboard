import { test, expect } from '@playwright/test';
import { BadgeApiClient, type Shield, Color } from '../po/badge-api/badge-api.po.js';
import { simpleReportV1 } from '../actions/report.action.js';
import { ReportClient } from '../po/reports/report-client.po.js';

test.describe('badge-api', () => {
  let client: BadgeApiClient;
  let reportClient: ReportClient;

  test.beforeEach(async ({ request }) => {
    client = new BadgeApiClient();
    reportClient = new ReportClient(request);
    await reportClient.uploadReport(simpleReportV1('github.com/stryker-mutator-test-organization/hello-org', 'master'));
  });

  test('should show "unknown" if the badge doesn\'t exist', async () => {
    const expected: Shield = {
      color: Color.Grey,
      label: 'Mutation score',
      message: 'unknown',
      logoColor: Color.WhiteSmoke,
      namedLogo: 'stryker',
      schemaVersion: 1,
    };
    const response = await client.badgeFor('a/b/c/master');
    expect(response).toEqual(expected);
  });

  test('should show the correct score and color for an existing report', async () => {
    const expected: Shield = {
      color: Color.Red,
      label: 'Mutation score',
      message: '33.3%',
      logoColor: Color.WhiteSmoke,
      namedLogo: 'stryker',
      schemaVersion: 1,
    };
    const response = await client.badgeFor('github.com/stryker-mutator-test-organization/hello-org/master');
    expect(response).toEqual(expected);
  });

  test('should allow slashes in version name', async () => {
    const expected: Shield = {
      color: Color.Red,
      label: 'Mutation score',
      message: '33.3%',
      logoColor: Color.WhiteSmoke,
      namedLogo: 'stryker',
      schemaVersion: 1,
    };
    await reportClient.uploadReport(
      simpleReportV1('github.com/stryker-mutator-test-organization/hello-org', 'feat/test'),
    );
    const response = await client.badgeFor('github.com/stryker-mutator-test-organization/hello-org/feat/test');
    expect(response).toEqual(expected);
  });
});
