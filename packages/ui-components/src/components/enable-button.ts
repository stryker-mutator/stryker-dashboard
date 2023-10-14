import { html } from 'lit';
import { BaseElement } from '../base';

export class EnableButton extends BaseElement {
  render() {
    return html`
      <button
        class="transition-all flex items-center flex-row align-center text-white border-2 border-neutral-600 rounded-md box-border font-bold"
      >
        <div class="z-[2] bg-neutral-600 box-border p-2">+</div>
        <p class="p-2">Enable Repository</p>
      </button>
    `;
  }
}
