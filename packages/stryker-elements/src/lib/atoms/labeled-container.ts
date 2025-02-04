import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-labeled-container')
export class LabeledContainer extends BaseElement {
  @property({ type: String })
  label = '';

  render() {
    return html`
      <div class="rounded border-2 border-zinc-600">
        <p class="text-l cursor-default bg-zinc-600 p-1 font-semibold text-zinc-100">${this.label}</p>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-labeled-container': LabeledContainer;
  }
}
