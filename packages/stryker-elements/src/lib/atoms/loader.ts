import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';

@customElement('sme-loader')
export class Loader extends BaseElement {
  @property({ type: Boolean, reflect: true })
  doneWithLoading = false;

  render() {
    const classes = classMap({
      'opacity-0': !this.doneWithLoading,
      'opacity-100': this.doneWithLoading,
    });

    return html`
      <div class="${classes} transition duration-300">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-loader': Loader;
  }
}
