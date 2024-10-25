import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './spinner';

import { BaseElement } from '../base-element';

@customElement('sme-loader')
export class Loader extends BaseElement {
  @property({ type: Boolean, reflect: true })
  doneWithLoading = false;

  @property({ type: Boolean })
  showSpinner = false;

  @property({ type: Number })
  spinnerDelay = 1000;

  connectedCallback(): void {
    super.connectedCallback();

    setTimeout(() => {
      if (this.doneWithLoading) return;

      this.showSpinner = true;
    }, this.spinnerDelay);
  }

  render() {
    return html`
      <div class="transition duration-300">
        ${this.showSpinner ? html`<sme-spinner></sme-spinner>` : ''}
        <!-- ${this.doneWithLoading ? html`<slot></slot>` : this.showSpinner ? html`<sme-spinner></sme-spinner>` : ''} -->
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-loader': Loader;
  }
}
