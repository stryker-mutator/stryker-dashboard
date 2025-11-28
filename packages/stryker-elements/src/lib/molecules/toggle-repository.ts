import { buildReportUrl } from '@stryker-mutator/dashboard-common';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { Button } from '../atoms/buttons/button.js';
import { BaseElement } from '../base-element.js';
import { MinusIcon, PlusIcon, SettingsIcon } from '../icons/svg-icons.js';

@customElement('sme-toggle-repository')
export class ToggleRepository extends BaseElement {
  @property({ type: Boolean, reflect: true })
  enabled = false;

  @property()
  name = '';

  @property()
  slug = '';

  @property({ type: Boolean })
  isToggling = false;

  render() {
    return html`
      <div
        @click=${this.#handleClick}
        class="${classMap({
          'opacity-50': this.isToggling,
        })} grid grid-cols-2 rounded-lg border-2 border-zinc-600 p-2 transition"
      >
        <a
          class="ms-2 inline-flex items-center text-lg font-bold text-white underline decoration-transparent transition hover:underline hover:decoration-white"
          href=${buildReportUrl(this.slug)}
        >
          ${this.name}
        </a>
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
          ${when(
            this.enabled,
            () => html`<sme-badge class="flex items-center" slug=${ifDefined(this.slug)}></sme-badge>`,
          )}
          ${when(
            this.enabled,
            () => this.#renderWhenEnabled(),
            () => this.#renderWhenDisabled(),
          )}
        </div>
      </div>
    `;
  }

  #renderWhenEnabled() {
    return html`
      <button
        @click=${this.#openRepositorySettings}
        class="ml-2 rounded bg-blue-600 p-1 transition hover:bg-blue-700"
        title="Open repository settings"
        ?disabled=${this.isToggling}
      >
        ${SettingsIcon}
      </button>
      <button
        @click=${this.#toggleRepository}
        class="ml-2 rounded bg-red-600 p-1 transition hover:bg-red-700"
        title="Disable repository"
        ?disabled=${this.isToggling}
      >
        ${MinusIcon}
      </button>
    `;
  }

  #renderWhenDisabled() {
    return html`
      <button
        @click=${this.#toggleRepository}
        class="ml-2 rounded bg-green-600 p-1 transition hover:bg-green-700"
        title="Enable repository"
        ?disabled=${this.isToggling}
      >
        ${PlusIcon}
      </button>
    `;
  }

  #openRepositorySettings() {
    this.dispatchEvent(new CustomEvent('openRepositorySettings', { detail: { name: this.name } }));
  }

  #toggleRepository() {
    this.isToggling = true;
    this.dispatchEvent(
      new CustomEvent('repositoryToggled', {
        detail: {
          slug: this.slug,
          checked: !this.enabled,
          ref: this,
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
