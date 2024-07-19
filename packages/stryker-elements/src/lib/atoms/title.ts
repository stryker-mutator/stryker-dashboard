import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';

const textSizes = {
  small: 'text-md',
  large: 'text-lg',
  larger: 'text-xl',
  largest: 'text-2xl',
};

@customElement('sme-title')
export class Title extends BaseElement {
  @property({ type: Boolean, reflect: true })
  noMargin = false;

  @property({ type: Boolean, reflect: true })
  alignLeft = false;

  @property()
  textSize: string = textSizes.largest;

  render() {
    return html`
      <h2
        class="${classMap({
          'mb-4 mt-6': !this.noMargin,
          'text-left': this.alignLeft,
          [this.textSize]: true,
        })} font-bold text-white"
      >
        <slot></slot>
      </h2>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-title': Title;
  }
}
