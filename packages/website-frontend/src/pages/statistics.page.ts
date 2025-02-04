import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { locationService } from '../services/location.service';
import { metricsService } from '../services/metrics.service';

@customElement('stryker-dashboard-statistics-page')
export class StatisticsPage extends LitElement {
  report = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    void this.#getStatistics().then();
  }

  override render() {
    console.log(this.report);
    return this.report;
  }

  async #getStatistics(): Promise<void> {
    // Get All Reports For a repository
    const metrics = await metricsService.getMetrics(this.#slug);
    console.log(metrics);
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
