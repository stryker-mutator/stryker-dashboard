import { html } from 'lit';
import { BaseElement } from '../base-element';
import { customElement } from 'lit/decorators.js';

@customElement('sme-hr')
export class Hr extends BaseElement {
  render() {
    return html`<hr class="my-2 rounded border-t-[3px] border-neutral-700" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-hr': Hr;
  }
}
