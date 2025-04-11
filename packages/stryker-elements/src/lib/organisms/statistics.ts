import '../atoms/progress-bar';
import '../atoms/statistic-tile';
import '../atoms/statistic-graph';
import '../atoms/metrics-selector';

import type { ReportStatisticsDto } from '@stryker-mutator/dashboard-common';
import type { PropertyValues } from 'lit';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('sme-statistics')
export class Statistics extends BaseElement {
  @property({ type: Array })
  projectStatistics: ReportStatisticsDto[] | undefined = undefined;

  #selectedReportStatistics: ReportStatisticsDto | undefined = undefined;

  render() {
    return html`<div class="grid grid-cols-6 gap-4 p-4">
      <section>
        <sme-report-selector
          class="col-start-1 col-end-3 row-start-1 row-end-2"
          .reports="${this.projectStatistics}"
          @reportSelected="${this.#updateSelectedReport}"
        ></sme-report-selector>
        <div><p>Current Report</p></div>
        <div><p>Available Reports</p></div>
      </section>
      <section class="col-span-6">
        <sme-progress-bar></sme-progress-bar>
      </section>

      <sme-statistic-tile title="Total files" statistic="--"></sme-statistic-tile>
      <sme-statistic-tile title="Total mutants" .statistic="${this.#selectedReportStatistics?.totalMutants?.toString() ?? "--"}"></sme-statistic-tile>

      <sme-statistic-tile title="Mutation score" .statistic="${this.#selectedReportStatistics?.mutationScore?.toString() ?? "--"}"></sme-statistic-tile>
      <sme-statistic-tile title="Based on covered code" .statistic="${this.#selectedReportStatistics?.mutationScoreBasedOnCoveredCode?.toString() ?? "--"}"></sme-statistic-tile>
      <sme-statistic-tile title="Previous Report" statistic="--"></sme-statistic-tile>
      <sme-statistic-tile title="Past 30 days" statistic="--"></sme-statistic-tile>

      <sme-statistic-tile title="Killed Mutants" .statistic="${this.#selectedReportStatistics?.killed?.toString() ?? "--"}"></sme-statistic-tile>
      <sme-statistic-tile title="Survived Mutants" .statistic="${this.#selectedReportStatistics?.survived?.toString() ?? "--"}"></sme-statistic-tile>
      <sme-statistic-tile title="Not Covered" .statistic="${this.#selectedReportStatistics?.noCoverage?.toString() ?? "--"}"></sme-statistic-tile>
      <sme-statistic-tile title="Ignored" .statistic="${this.#selectedReportStatistics?.ignored?.toString() ?? "--"}"></sme-statistic-tile>

      <sme-statistic-graph
        class="col-start-3 col-end-7 row-start-4 row-end-6"
        .metrics="${this.projectStatistics}"
      ></sme-statistic-graph>
    </div>`;
  }

  #updateSelectedReport(event: CustomEvent<{ metrics: ReportStatisticsDto }>) {
    console.log('updateSelectedReport', event.detail.metrics);
    this.#selectedReportStatistics = event.detail.metrics;

    console.log('this.#selectedReportStatistics', this.#selectedReportStatistics);
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-statistics': Statistics;
  }
}
