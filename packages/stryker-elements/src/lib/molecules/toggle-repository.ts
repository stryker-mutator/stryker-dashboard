import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { BaseElement } from '../base-element.js';
import { Button } from '../atoms/buttons/button.js';

@customElement('sme-toggle-repository')
export class ToggleRepository extends BaseElement {
  @property({ type: Boolean, reflect: true })
  enabled = false;

  @property()
  name = '';

  @property()
  slug = '';

  render() {
    return html`
      <div
        @click="${this.#handleClick}"
        class="grid cursor-pointer grid-cols-2 rounded-lg border-2 border-neutral-600 p-2"
      >
        <span class="ms-2 flex items-center text-lg font-bold text-white">${this.name}</span>
        ${this.#renderToggleButton()}
      </div>
    `;
  }

  #handleClick(e: MouseEvent) {
    if (e.target instanceof Button) {
      return;
    }

    this.dispatchEvent(new CustomEvent('repositoryClicked'));
  }

  #renderToggleButton() {
    return html`
      <div class="flex">
        <div class="ms-auto flex">
          ${when(this.enabled, () => html`<sme-badge class="me-6 flex items-center" slug="${this.slug}"></sme-badge>`)}
          <sme-button class="flex" @click="${this.#toggleRepository}">
            ${this.enabled ? 'Disable' : 'Enable'}
          </sme-button>
        </div>
      </div>
    `;
  }

  #toggleRepository() {
    this.dispatchEvent(
      new CustomEvent('repositoryToggled', {
        detail: {
          slug: this.slug,
          checked: !this.enabled,
        },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-toggle-repository': ToggleRepository;
  }
}
