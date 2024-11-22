import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('sme-split-layout')
export class SplitLayout extends BaseElement {
  @property({ type: Boolean })
  withBackground = false;

  render() {
    return html`
      <div class="${classMap({ 'bg-elementsDark': this.withBackground })} flex p-4">
        <div class="max-w-split">
          <slot name="left"></slot>
        </div>
        <sme-hr class="ml-2 mr-2" color="bright" direction="vertical"></sme-hr>
        <div class="max-w-split">
          <slot name="right"></slot>
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
