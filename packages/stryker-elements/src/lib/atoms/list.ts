import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('sme-list')
export class List extends BaseElement {
  render() {
    return html`<slot class="grid gap-2"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-list': List;
  }
}
