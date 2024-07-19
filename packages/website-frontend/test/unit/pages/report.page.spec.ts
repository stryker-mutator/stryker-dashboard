import { beforeEach, it, describe, expect, vi } from 'vitest';

import { MutationTestResult } from 'mutation-testing-report-schema';

import '@stryker-mutator/stryker-elements';

import simpleReport from '../testResources/simple-report.json';
import { CustomElementFixture } from '../../helpers/custom-element-fixture';
import { ReportPage } from '../../../src/pages/report.page';
import { locationService } from '../../../src/services/location.service';
import { reportService } from '../../../src/services/report.service';

describe(ReportPage.name, () => {
  let sut: CustomElementFixture<ReportPage>;

  beforeEach(async () => {
    sut = new CustomElementFixture('stryker-dashboard-report-page', { autoConnect: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', async () => {
    expect(sut.element).to.be.instanceOf(ReportPage);
  });

  it('should render correctly when no report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch' } as Location));
    reportService.getReport = vi.fn(() => Promise.resolve(undefined));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(sut.element.didNotFindReport).to.be.true;
    expect(
      sut.element.shadowRoot
        ?.querySelector('sme-spatious-layout')
        ?.querySelector('sme-notify')
        ?.textContent
    ).to.eq('Report could not be found...');

    expect(reportService.getReport).toHaveBeenCalledWith('provider/org/my-repo/branch');
  });

  it('should render correctly when a report is found', async () => {
    // Arrange
    reportService.getReport = vi.fn(() => Promise.resolve(simpleReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(sut.element.didNotFindReport).to.be.false;
    expect(sut.element.shadowRoot?.querySelector('sme-spatious-layout')).to.be.null;
    expect(sut.element.shadowRoot?.querySelector('mutation-test-report-app')).to.not.be.null;
    expect(reportService.getReport).toHaveBeenCalled();
  });
});
