import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { html } from 'lit';
import { map } from 'lit/directives/map.js';

export class Dropdown extends BaseElement {
  @property()
  id: string = '';

  @property()
  options: Array<{ name: string; value: string }> = [];

  render() {
    return html` <select
      id="${this.id}"
      class="w-full rounded-lg bg-neutral-800 p-2 text-3xl text-white"
      @change="${this.#handleChange}"
    >
      ${map(
        this.options,
        (option) => html`<option value="${option.value}">${option.name}</option>`,
      )}
    </select>`;
  }

  #handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.dispatchEvent(
      new CustomEvent('dropdownChanged', {
        detail: {
          value: target.value,
        },
      }),
    );
  }
}
