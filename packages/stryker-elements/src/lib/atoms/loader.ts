import './spinner';
import { BaseElement } from '../base-element';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

@customElement('sme-loader')
export class Loader extends BaseElement {
  @property({ type: Boolean, reflect: true })
  useSpinner = false;

  @property({ type: Boolean, reflect: true })
  loading = true;

  #showSpinner = false;
  #showSpinnerDelay = 1000;

  firstUpdated() {
    setTimeout(() => {
      if (!this.loading) return;
      this.#showSpinner = true;
      this.requestUpdate();
    }, this.#showSpinnerDelay);
  }

  render() {
    const loadingClassMap = classMap({
      display: this.loading ? 'block' : 'none',
      'opacity-0': !this.loading || !this.#showSpinner,
      'opacity-100': this.loading && this.#showSpinner,
      'pointer-events-none': !this.loading,
    });

    const contentClassMap = classMap({
      display: this.loading ? 'none' : 'block',
      'opacity-0': this.loading,
      'opacity-100': !this.loading,
      'pointer-events-none': this.loading,
    });

    return this.useSpinner
      ? html`<div class="">
          <div class="${contentClassMap}  transition duration-300">
            <slot></slot>
          </div>
          <div class="${loadingClassMap}  transition duration-300">
            <sme-spinner></sme-spinner>
          </div>
        </div>`
      : html`
          <div class="${contentClassMap} transition duration-300">
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
