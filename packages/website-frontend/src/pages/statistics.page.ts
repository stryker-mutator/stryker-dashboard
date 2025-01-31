import type { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { calculateMetrics } from 'mutation-testing-metrics';
import type { MutationTestResult } from 'mutation-testing-report-schema';

import { locationService } from '../services/location.service';
import { reportService } from '../services/report.service';

@customElement('stryker-dashboard-statistics-page')
export class StatisticsPage extends LitElement {
  report = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    this.#getStatistics();
  }

  override render() {
    console.log(this.report);
    return this.report;
  }

  async #getStatistics(): void {
    // Get All Reports For a repository
    const reports = await reportService.getReports(this.#baseSlug);

    const reportMetrics = [];
    reports.forEach((report: MutationTestResult | MutationScoreOnlyResult | undefined) => {
      const metric = calculateMetrics(report.files);
      reportMetrics.push(metric);
    });
    // Calculate all the metrics for those reports
    // Create a graph based on those metrics
    reportService.getReport(this.#slug).then((report: MutationTestResult | MutationScoreOnlyResult | undefined) => {
      const metrics = calculateMetrics(report.files);
      console.log(metrics);

      // get files, childItems, metrics,
      // Add datetime and report "ID" (title?)

      // var statistics = {
      //   date: Date.now(),
      //   x: report.title,
      // };

      this.requestUpdate();
    });
  }

  get #baseSlug() {
    return locationService.getLocation().pathname.split('/statistics/').join('');
  }

  get #slug() {
    const location = locationService.getLocation();
    return location.search ? this.#baseSlug + location.search : this.#baseSlug;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-statistics-page': StatisticsPage;
  }
}
