import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.ts';

@customElement('sme-top-bar')
export class TopBar extends BaseElement {
  @property({ type: String })
  logoUrl = '';

  render() {
    return html`<div class="text-l flex h-16 flex-row items-center bg-zinc-800 p-2 text-white">
      <img class="h-12 w-12 p-2" src=${this.logoUrl} alt="Stryker logo" />
      <h2 class="px-1">
        <a href="/" class="font-bold text-white no-underline transition-all hover:cursor-pointer hover:text-red-500"
          >Stryker Mutator</a
        >
        | Dashboard
      </h2>
      <div class="ml-auto"><slot name="right-side"></slot></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-top-bar': TopBar;
  }
}
