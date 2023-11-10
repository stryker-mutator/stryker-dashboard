import { html } from 'lit';
import { BaseElement } from '../base';

export class EnableButton extends BaseElement {
  render() {
    return html`
      <button
        class="align-center box-border flex flex-row items-center rounded-md border-2 border-neutral-600 font-bold text-white transition-all"
      >
        <div class="z-[2] box-border bg-neutral-600 p-2">+</div>
        <p class="p-2">Enable Repository</p>
      </button>
    `;
  }
}
