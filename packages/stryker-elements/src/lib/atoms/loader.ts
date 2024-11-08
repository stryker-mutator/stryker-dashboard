import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './spinner';
import { BaseElement } from '../base-element';
import { classMap } from 'lit/directives/class-map.js';

@customElement('sme-loader')
export class Loader extends BaseElement {
  #doneWithLoading = false;

  @property({ type: Boolean, reflect: true })
  get doneWithLoading() {
    return this._doneWithLoading;
  }

  set doneWithLoading(value: boolean) {
    const oldValue = this._doneWithLoading;
    this._doneWithLoading = value;
    this.requestUpdate('doneWithLoading', oldValue);
    this.onDoneWithLoadingChanged(value);
  }

  @property({ type: Boolean })
  showSpinner = false;

  @property({ type: Number })
  spinnerDelay = 1000;

  @property({ type: Boolean })
  showContent = false;

  onDoneWithLoadingChanged(value: boolean) {
    if (value) {
      this.showSpinner = false;
      this.showContent = true;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    setTimeout(() => {
      if (this.doneWithLoading) return;

      this.showSpinner = true;
    }, this.spinnerDelay);
  }

  render() {
    const contentClasses = classMap({
      'opacity-0': !this.showContent,
      'opacity-100': this.showContent,
    });

    const spinnerClasses = classMap({
      'opacity-0': !this.showSpinner,
      'opacity-100': this.showSpinner,
    });

    return html`
      <div class="${spinnerClasses} absolute mx-auto w-full transition duration-300">
        <sme-spinner></sme-spinner>
      </div>
      <div class="${contentClasses} transition duration-300">
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
