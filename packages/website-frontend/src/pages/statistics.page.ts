import type { ReportStatisticsDto } from '@stryker-mutator/dashboard-common';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { locationService } from '../services/location.service';
import { statisticsService } from '../services/statistics.service';

@customElement('stryker-dashboard-statistics-page')
export class StatisticsPage extends LitElement {
  @state()
  projectStatistics: ReportStatisticsDto[] | undefined = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    void statisticsService.getStatistics(this.#slug).then((projectStatistics) => {
      this.projectStatistics = projectStatistics;
    });
  }

  override render() {
    return html`
      <sme-statistic-tile title="Total files" statistic="--"></sme-statistic-tile>
      <sme-statistics .projectStatistics="${this.projectStatistics}"></sme-statistics>
    `;
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
