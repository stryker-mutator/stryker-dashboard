import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../../base-element';

@customElement('sme-toggle-button')
export class ToggleButton extends BaseElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  render() {
    return html`
      <label class="inline-flex cursor-pointer items-center justify-center">
        <input type="checkbox" class="peer sr-only" ?checked="${this.checked}" @change="${this.#handleChange}" />
        <div
          class="relative h-6 w-11 rounded-full bg-zinc-600 peer-checked:bg-red-700 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all peer-checked:after:translate-x-full"
        ></div>
      </label>
    `;
  }

  #handleChange() {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('stateChanged', { detail: { checked: this.checked } }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-toggle-button': ToggleButton;
  }
}
