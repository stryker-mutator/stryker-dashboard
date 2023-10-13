import { html } from 'lit';
import { BaseElement } from '../base.ts';
import '../buttons/sign-in-button.ts';

export class TopBar extends BaseElement {
  render() {
    return html` <div
      class="text-white items-center bg-neutral-800 h-16 p-2 m-2 text-l flex flex-row"
    >
      <h2 class="p-1 font-bold">Stryker Mutator</h2>
      <p>| Dashboard</p>
      <sign-in-button class="ml-auto"></sign-in-button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'top-bar': TopBar;
  }
}

customElements.define('top-bar', TopBar);
