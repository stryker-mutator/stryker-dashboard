import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('sme-spinner')
export class Spinner extends BaseElement {
  render() {
    return html`
      <div class="m-6 grid place-items-center">
        <img class="h-12 animate-spin" src="/images/stryker.svg" />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-spinner': Spinner;
  }
}
