import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-getting-started-step')
export class GettingStartedStep extends BaseElement {
  @property({ type: String })
  title = '';

  render() {
    return html`
      <div class="block text-white">
        <h2 class="mb-4 text-xl font-bold">${this.title}</h2>
        <div class="rounded-lg border-2 border-zinc-600 p-4">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-getting-started-step': GettingStartedStep;
  }
}
