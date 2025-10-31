import '../atoms/spinner.ts';

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element.ts';

@customElement('sme-loader')
export class Loader extends BaseElement {
  @property({ type: Boolean, reflect: true })
  useSpinner = false;

  @property({ type: Boolean, reflect: true })
  loading = true;

  @state()
  shouldHideSpinnerAfterLoaded = false;

  #showSpinner = false;
  #showSpinnerDelay = 1000;
  #hideSpinnerTransitionDelay = 300;

  firstUpdated() {
    setTimeout(() => {
      if (!this.loading) {
        return;
      }

      this.requestUpdate();
      this.#showSpinner = true;
    }, this.#showSpinnerDelay);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('loading')) {
      setTimeout(() => {
        this.shouldHideSpinnerAfterLoaded = !this.loading;
      }, this.#hideSpinnerTransitionDelay);
    }
  }

  render() {
    const loadingClassMap = classMap({
      hidden: this.shouldHideSpinnerAfterLoaded,
      'opacity-0': !this.loading || !this.#showSpinner,
      'opacity-100': this.loading && this.#showSpinner,
      'pointer-events-none': !this.loading,
    });

    const contentClassMap = classMap({
      'opacity-0': this.loading,
      'opacity-100': !this.loading,
      'pointer-events-none': this.loading,
    });

    return this.useSpinner
      ? html`
          <div class="relative flex justify-center">
            <div class="${contentClassMap} w-full transition duration-300">
              <slot></slot>
            </div>
            <div class="${loadingClassMap} absolute top-0 transition duration-300">
              <sme-spinner></sme-spinner>
            </div>
          </div>
        `
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
