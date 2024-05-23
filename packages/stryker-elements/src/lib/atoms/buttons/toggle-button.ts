import { property } from 'lit/decorators.js';
import { BaseElement } from '../../base-element';
import { html } from 'lit';

export class ToggleButton extends BaseElement {
  @property()
  checked = false;

  render() {
    return html`
      <label class="inline-flex cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          class="peer sr-only"
          .checked="${this.checked}"
          @change="${this.#onChange}"
        />
        <div
          class="relative h-6 w-11 rounded-full bg-neutral-600 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all peer-checked:bg-red-700 peer-checked:after:translate-x-full peer-focus:outline-none"
        ></div>
      </label>
    `;
  }

  #onChange() {
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('stateChanged', { detail: { checked: this.checked } }));
  }
}
