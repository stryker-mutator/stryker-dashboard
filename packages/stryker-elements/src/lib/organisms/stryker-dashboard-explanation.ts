import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('sme-stryker-dashboard-explanation')
export class StrykerDashboardExplanation extends BaseElement {
  render() {
    return html`
      <div class="bg-zinc-900/50 p-8">
        <h2 class="mb-4 text-center text-2xl font-bold text-white">Why should I use Stryker Dashboard?</h2>
        <div class="flex justify-center space-x-5">
          <div class="flex rounded border border-red-800 bg-red-800/50">
            <p class="bg-red-800 p-1 text-lg">🌐</p>
            <p class="px-2 py-1 text-base text-white">Your reports available, from anywhere</p>
          </div>
          <div class="flex rounded border border-red-800 bg-red-800/50">
            <p class="bg-red-800 p-1 text-lg">♾️</p>
            <p class="px-2 py-1 text-base text-white">Free for open source</p>
          </div>
          <div class="flex rounded border border-red-800 bg-red-800/50">
            <p class="bg-red-800 p-1 text-lg">⭐</p>
            <p class="px-2 py-1 text-base text-white">Showcase your test effectiveness</p>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-stryker-dashboard-explanation': StrykerDashboardExplanation;
  }
}
