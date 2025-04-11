import type { ReportStatisticsDto } from '@stryker-mutator/dashboard-common';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-report-selector')
export class ReportSelector extends BaseElement {
  @property({ type: Array })
  reports: ReportStatisticsDto[] | undefined = undefined;

  #selectedReport: ReportStatisticsDto | undefined = undefined;

  render() {
    return html`
      <div class="col-span-1 flex h-full flex-col items-center bg-zinc-700 text-white">
        <h3 class="text-m mt-4">Select report</h3>
        <select
          class="mt-4 w-full rounded-lg border-2 border-neutral-600 bg-zinc-800 p-2 text-white"
          @change="${this.#handleChange}"
        >
          ${this.reports?.map((report, index) => html`<option ?selected="${index === 0}" value="${index}">${report.createdAt}</option>`)}
        </select>
      </div>
    `;
  }

  #handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.#selectedReport = this.reports?.[Number(target.value)];
    this.dispatchEvent(
      new CustomEvent('reportSelected', {
        detail: {
          metrics: this.#selectedReport,
        },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-report-selector': ReportSelector;
  }
}
