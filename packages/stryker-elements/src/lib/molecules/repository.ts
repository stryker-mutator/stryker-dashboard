import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element.js';
import { html } from 'lit';

import '../../exports/lib/atoms/badge';

export class Repository extends BaseElement {
  @property()
  reportLink = 'https://dashboard.stryker-mutator.io/reports/';

  @property()
  name = '';

  @property()
  slug = '';

  @property()
  mutationScore = 0;

  @property()
  totalSteps = 100;

  render() {
    return html`
      <div class="grid grid-cols-3 rounded-lg border-2 border-neutral-600 p-3">
        <a class="col-span-1 font-bold text-white underline" href="${this.reportLink}${this.slug}"
          >${this.name}</a
        >
        <sme-badge class="col-span-2 ms-auto" slug="${this.slug}" />
      </div>
    `;
  }
}
