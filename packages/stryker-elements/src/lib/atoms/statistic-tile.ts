import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-statistic-tile')
export class StatisticTile extends BaseElement {
  @property({ type: String })
  title = '';

  @property({ type: String })
  statistic = '';

  render() {
    return html`
      <div class="col-span-1 flex flex-col items-center bg-zinc-700 text-white">
        <h3 class="text-m mt-4 font-bold">${this.title}</h3>
        <span class="text-4xl mt-7 mb-10 font-bold">${this.statistic}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-statistic-tile': StatisticTile;
  }
}
