import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseElement } from '../base-element';

@customElement('sme-spinner')
export class Spinner extends BaseElement {
  render() {
    return html`
      <div class="w-100 place-items-center grid">
        <img class="h-12 animate-spin" src="https://stryker-mutator.io/images/stryker.svg" />
      </div>
    `;
  }
}
