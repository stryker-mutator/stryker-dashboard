import { BadgeApiClient, Shield, Color } from '../po/badge-api/badge-api.po';
import { uploadReport, simpleReport } from '../actions/report.action';
import { expect } from 'chai';

describe('badge-api', () => {
  let client: BadgeApiClient;

  before(async () => {
    client = new BadgeApiClient();
    await uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'master'));
  });

  it('should show "unknown" if the badge doesn\'t exist', async () => {
    const expected: Shield = {
      color: Color.Grey,
      label: 'Mutation score',
      message: 'unknown',
      schemaVersion: 1
    };
    const response = await client.badgeFor('a/b/c/master');
    expect(response.data).deep.eq(expected);
  });

  it('should show the correct score and color for an existing report', async () => {
    const expected: Shield = {
      color: Color.Red,
      label: 'Mutation score',
      message: '33.3%',
      schemaVersion: 1
    };
    const response = await client.badgeFor('github.com/stryker-mutator-test-organization/hello-org/master');
    expect(response.data).deep.eq(expected);
  });

  it('should allow slashes in version name', async () => {
    const expected: Shield = {
      color: Color.Red,
      label: 'Mutation score',
      message: '33.3%',
      schemaVersion: 1
    };
    await uploadReport(simpleReport('github.com/stryker-mutator-test-organization/hello-org', 'feat/test'));
    const response = await client.badgeFor('github.com/stryker-mutator-test-organization/hello-org/feat/test');
    expect(response.data).deep.eq(expected);
  });
});
