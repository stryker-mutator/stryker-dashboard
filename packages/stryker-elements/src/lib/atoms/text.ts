import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-text')
export class Text extends BaseElement {
  @property({ type: Boolean, reflect: true })
  noMargin = false;

  @property({ type: Boolean, reflect: true })
  bold = false;

  render() {
    return html`
      <p class="${classMap({ 'my-2': !this.noMargin, 'font-bold': this.bold })} text-white">
        <slot></slot>
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-text': Text;
  }
}
