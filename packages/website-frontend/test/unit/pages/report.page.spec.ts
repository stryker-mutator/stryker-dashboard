import { beforeEach, it, describe, expect, vi } from 'vitest';

import { MutationTestResult } from 'mutation-testing-report-schema';

import '@stryker-mutator/stryker-elements';

import pendingReport from '../testResources/simple-pending-report.json';
import simpleReport from '../testResources/simple-report.json';
import scoreOnlyReport from '../testResources/score-only-report.json';

import { CustomElementFixture } from '../../helpers/custom-element-fixture';
import { ReportPage } from '../../../src/pages/report.page';
import { locationService } from '../../../src/services/location.service';
import { reportService } from '../../../src/services/report.service';
import { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';

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

  it('should render correctly when a full report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch' } as Location));
    reportService.getReport = vi.fn(() => Promise.resolve(simpleReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.whenStable();
    await sut.waitFor(() => sut.element.shadowRoot?.querySelector('mutation-test-report-app') !== null);

    // Assert
    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement?.shadowRoot?.textContent).to.contain('my-repo/branch - Stryker Dashboard')

    expect(sut.element.didNotFindReport).to.be.false;
    expect(sut.element.shadowRoot?.querySelector('sme-spatious-layout')).to.be.null;
    expect(reportService.getReport).toHaveBeenCalled();
  });

  it('should have the correct title when a module is specified', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch', search: '?module=my-module' } as Location));
    reportService.getReport = vi.fn(() => Promise.resolve(simpleReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.whenStable();
    await sut.waitFor(() => sut.element.shadowRoot?.querySelector('mutation-test-report-app') !== null);

    // Assert
    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement?.shadowRoot?.textContent).to.contain('my-repo/branch/my-module - Stryker Dashboard') ;
    expect(reportService.getReport).toHaveBeenCalled();
  });

  it('should render correctly when a score-only report is found', async () => {
    // Arrange
    reportService.getReport = vi.fn(() => Promise.resolve(scoreOnlyReport as MutationScoreOnlyResult));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(sut.element.didNotFindReport).to.be.false;
    expect(sut.element.shadowRoot?.querySelector('mutation-test-report-app')).to.be.null;
    expect(sut.element.shadowRoot?.textContent).to.contain('Mutation score: 42');
    expect(reportService.getReport).toHaveBeenCalled();
  });

  it('should render correctly when a pending report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch', search: '?realTime=true' } as Location));
    reportService.getReport = vi.fn(() => Promise.resolve(pendingReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.waitFor(() => sut.element.shadowRoot?.querySelector('mutation-test-report-app')?.getAttribute('sse') !== undefined);

    // Assert
    expect(sut.element.didNotFindReport).to.be.false;

    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement).to.not.be.null;
    expect(reportElement?.getAttribute('sse')).to.eq('/api/real-time/provider/org/my-repo/branch');
    expect(reportService.getReport).toHaveBeenCalledWith("provider/org/my-repo/branch?realTime=true");
  });
});
