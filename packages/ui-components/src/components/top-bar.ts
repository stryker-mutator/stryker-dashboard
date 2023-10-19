import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class TopBar extends BaseElement {
  @property({ type: String })
  logo = '';

  getLogo() {
    if (this.logo) {
      return html``;
    } else {
      return html``;
    }
  }

  render() {
    return html` <div
      class="text-white items-center bg-neutral-800 h-16 p-2 text-l flex flex-row"
    >
      ${this.logo && html`<img class="p-2 h-12" src="${this.logo}" />`}
      <h2 class="px-1">
        <a
          href="/"
          class="hover:cursor-pointer hover:text-red-500 transition-all text-white no-underline font-bold"
          >Stryker Mutator</a
        >
        | Dashboard
      </h2>
      <div class="ml-auto"><slot name="user"></slot></div>
    </div>`;
  }
}
