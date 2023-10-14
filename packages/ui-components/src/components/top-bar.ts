import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class TopBar extends BaseElement {
  @property({ type: String })
  logo = '';

  getLogo() {
    if (this.logo) {
      return html`<img class="p-2 h-12" src="${this.logo}" />`;
    } else {
      return html``;
    }
  }

  render() {
    return html` <div
      class="text-white items-center bg-neutral-800 h-16 p-2 text-l flex flex-row"
    >
      ${this.getLogo()}
      <h2 class="px-1"><span class="font-bold">Stryker Mutator</span> | Dashboard</h2>
      <div class="ml-auto"><slot name="user"></slot></div>
    </div>`;
  }
}
