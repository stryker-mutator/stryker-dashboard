import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-split-layout')
export class SplitLayout extends BaseElement {
  render() {
    return html`
      <div class="flex p-4">
        <div class="max-w-split">
          <slot  name="left"></slot>
        </div>
        <sme-hr class="ml-2 mr-2" color="bright" direction="vertical"></sme-hr>
        <div class="max-w-split">
          <slot  name="right"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-split-layout': SplitLayout;
  }
}
