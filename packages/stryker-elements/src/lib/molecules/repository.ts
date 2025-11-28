import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-repository')
export class Repository extends BaseElement {
  @property()
  reportLink = 'https://dashboard.stryker-mutator.io/reports/';

  @property()
  name = '';

  @property()
  slug = '';

  @property({ type: Number })
  mutationScore = 0;

  @property({ type: Number })
  totalSteps = 100;

  render() {
    return html`
      <div class="grid grid-cols-3 rounded-lg border-2 border-zinc-600 p-3">
        <a class="col-span-1 font-bold text-white underline" href="${this.reportLink}${this.slug}">${this.name}</a>
        <sme-badge class="col-span-2 ms-auto" slug=${this.slug}></sme-badge>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-repository': Repository;
  }
}
