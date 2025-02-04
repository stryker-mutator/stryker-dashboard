import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { BaseElement } from '../base-element';

@customElement('sme-dropdown')
export class Dropdown extends BaseElement {
  @property()
  id = '';

  @property({ type: Array })
  options: { name: string; value: string }[] = [];

  render() {
    return html`
      <select
        id="${this.id}"
        class="w-full rounded-lg bg-zinc-800 p-2 text-3xl text-white"
        @change="${this.#handleChange}"
      >
        ${map(this.options, (option) => html`<option value="${option.value}">${option.name}</option>`)}
      </select>
    `;
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

declare global {
  interface HTMLElementTagNameMap {
    'sme-dropdown': Dropdown;
  }
}
