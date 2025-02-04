import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

@customElement('sme-hr')
export class Hr extends BaseElement {
  render() {
    return html`<hr class="my-2 rounded border-t-[3px] border-zinc-700" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-hr': Hr;
  }
}
