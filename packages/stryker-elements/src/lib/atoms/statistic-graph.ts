import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type Metrics } from 'mutation-testing-metrics';

import { BaseElement } from '../base-element.js';

@customElement('sme-statistic-graph')
export class StatisticGraph extends BaseElement {
  @property({ type: Array })
  metrics: Metrics[] | undefined = undefined;

  render() {
    return html`
      <div class="col-span-1 flex h-full flex-col items-center bg-zinc-700 text-white">
        <h3 class="text-m mt-4">Mutation score all files past 30 days</h3>
        <!-- TODO: Implement Graph -->
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-statistic-graph': StatisticGraph;
  }
}
