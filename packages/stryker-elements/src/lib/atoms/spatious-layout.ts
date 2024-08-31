import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-spatious-layout')
export class SpatiousLayout extends BaseElement {
  render() {
    return html`
      <div class="m-auto max-w-screen-xl p-8">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-spatious-layout': SpatiousLayout;
  }
}
