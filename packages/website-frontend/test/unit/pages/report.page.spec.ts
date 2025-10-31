import '@stryker-mutator/stryker-elements';

import type { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import type { MutationTestResult } from 'mutation-testing-report-schema';

import { ReportPage } from '../../../src/pages/report.page.ts';
import { locationService } from '../../../src/services/location.service.ts';
import { reportService } from '../../../src/services/report.service.ts';
import { CustomElementFixture } from '../../helpers/custom-element-fixture.ts';
import scoreOnlyReport from '../testResources/score-only-report.json' with { type: 'json' };
import pendingReport from '../testResources/simple-pending-report.json' with { type: 'json' };
import simpleReport from '../testResources/simple-report.json' with { type: 'json' };

describe(ReportPage.name, () => {
  let sut: CustomElementFixture<ReportPage>;

  beforeEach(() => {
    sut = new CustomElementFixture('stryker-dashboard-report-page', { autoConnect: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sut.dispose();
  });

  it('should be of the correct instance', () => {
    expect(sut.element).to.be.instanceOf(ReportPage);
  });

  it('should render correctly when no report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch' }) as Location);
    reportService.getReport = vi.fn(() => Promise.resolve(undefined));

    // Act
    sut.connect();
    await sut.whenStable();

    // Assert
    expect(sut.element.didNotFindReport).to.be.true;
    expect(sut.element.shadowRoot?.querySelector('sme-spatious-layout')?.querySelector('sme-notify')).toHaveTextContent(
      'Report could not be found...',
    );

    expect(reportService.getReport).toHaveBeenCalledWith('provider/org/my-repo/branch');
  });

  it('should render correctly when a full report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(() => ({ pathname: '/reports/provider/org/my-repo/branch' }) as Location);
    reportService.getReport = vi.fn(() => Promise.resolve(simpleReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.whenStable();
    await sut.waitFor(() => sut.element.shadowRoot?.querySelector('mutation-test-report-app') !== null);

    // Assert
    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement?.shadowRoot).toHaveTextContent('my-repo/branch - Stryker Dashboard');

    expect(sut.element.didNotFindReport).to.be.false;
    expect(sut.element.shadowRoot?.querySelector('sme-spatious-layout')).not.toBeInTheDocument();
    expect(reportService.getReport).toHaveBeenCalled();
  });

  it('should have the correct title when a module is specified', async () => {
    // Arrange
    locationService.getLocation = vi.fn(
      () =>
        ({
          pathname: '/reports/provider/org/my-repo/branch',
          search: '?module=my-module',
        }) as Location,
    );
    reportService.getReport = vi.fn(() => Promise.resolve(simpleReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.whenStable();
    await sut.waitFor(() => sut.element.shadowRoot?.querySelector('mutation-test-report-app') !== null);

    // Assert
    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement?.shadowRoot).toHaveTextContent('my-repo/branch/my-module - Stryker Dashboard');
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
    expect(sut.element.shadowRoot?.querySelector('mutation-test-report-app')).not.toBeInTheDocument();
    expect(sut.element.shadowRoot).toHaveTextContent('Mutation score: 42');
    expect(reportService.getReport).toHaveBeenCalled();
  });

  it('should render correctly when a pending report is found', async () => {
    // Arrange
    locationService.getLocation = vi.fn(
      () =>
        ({
          pathname: '/reports/provider/org/my-repo/branch',
          search: '?realTime=true',
        }) as Location,
    );
    reportService.getReport = vi.fn(() => Promise.resolve(pendingReport as unknown as MutationTestResult));

    // Act
    sut.connect();
    await sut.waitFor(
      () => sut.element.shadowRoot?.querySelector('mutation-test-report-app')?.getAttribute('sse') !== undefined,
    );

    // Assert
    expect(sut.element.didNotFindReport).to.be.false;

    const reportElement = sut.element.shadowRoot?.querySelector('mutation-test-report-app');
    expect(reportElement).toBeInTheDocument();
    expect(reportElement).toHaveAttribute('sse', '/api/real-time/provider/org/my-repo/branch');
    expect(reportService.getReport).toHaveBeenCalledWith('provider/org/my-repo/branch?realTime=true');
  });
});
