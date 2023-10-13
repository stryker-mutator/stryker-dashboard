import { html } from 'lit';
import { BaseElement } from '../base.ts';
import '../buttons/sign-in-button.ts';
import { property } from 'lit/decorators.js';

export class TopBar extends BaseElement {
  @property({ type: String })
  logo = '';

  getLogo() {
    if (this.logo) {
      return html`<img class="p-2 h-8" src="${this.logo}" />`;
    } else {
      return html``;
    }
  }

  render() {
    return html` <div
      class="text-white items-center bg-neutral-800 h-16 p-2 m-2 text-l flex flex-row"
    >
      ${this.getLogo()}
      <h2 class="p-1 font-bold">Stryker Mutator</h2>
      <p>| Dashboard</p>
      <div class="ml-auto"><slot name="user"></slot></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'top-bar': TopBar;
  }
}

customElements.define('top-bar', TopBar);
