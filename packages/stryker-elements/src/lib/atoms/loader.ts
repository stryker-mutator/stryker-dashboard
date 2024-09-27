import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseElement } from '../base-element';
import { when } from 'lit/directives/when.js';

@customElement('sme-loader')
export class Loader extends BaseElement {
  @property({ type: Boolean, reflect: true })
  doneWithLoading = false;

  @state()
  startMoreObviousLoading = true;

  connectedCallback(): void {
    super.connectedCallback();

    // setTimeout(() => {
    //   if (this.doneWithLoading) {
    //     return;
    //   }

    //   this.startMoreObviousLoading = true;
    // }, 2000);
  }

  render() {
    const classes = classMap({
      'opacity-0': !this.doneWithLoading,
      'opacity-100': this.doneWithLoading,
    });

    return html`
      <div class="${classes} transition duration-300">
        <slot></slot>
      </div>
      ${when(this.startMoreObviousLoading, () => this.#renderObviousLoader())}
    `;
  }

  #renderObviousLoader() {
    return html`
      <div class="flex justify-center w-full h-full">
        <div class="flex flex-col items-center h-[100px] w-[100px] transition">
          <div class="h-1 w-3 bg-white rotate-90 translate-y-[4px]"></div>
          <div class="flex w-full m-auto">
            <div class="h-1 w-3 bg-white mr-auto"></div>
            <div class="h-1 w-3 bg-white ml-auto"></div>
          </div>
          <div class="h-1 w-3 bg-white rotate-90 translate-y-[-4px]"></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-loader': Loader;
  }
}
