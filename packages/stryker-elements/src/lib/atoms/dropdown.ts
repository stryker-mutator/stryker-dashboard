import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { BaseElement } from '../base-element';

@customElement('sme-dropdown')
export class Dropdown extends BaseElement {
  @property()
  id = '';

  @property({ type: Array })
  options: { name: string; value: string }[] = [];

  @property({ type: String })
  selectedOption = '';

  @property({ type: Boolean })
  withDisabledEmtpyOption = false;

  render() {
    return html`
      <select
        id="${this.id}"
        class="w-full rounded-lg bg-neutral-800 p-2 text-3xl text-white"
        @change="${this.#handleChange}"
      >
        ${when(
          this.withDisabledEmtpyOption,
          () => html`<option value="" disabled selected>Select an option</option>`,
          () => nothing,
        )}
        ${map(
          this.options,
          (option) => html`
            <option value="${option.value}" ?selected="${option.value === this.selectedOption}">${option.name}</option>
          `,
        )}
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
