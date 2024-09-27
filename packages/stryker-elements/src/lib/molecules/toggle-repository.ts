import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { buildReportUrl } from '@stryker-mutator/dashboard-common';

import { BaseElement } from '../base-element.js';
import { Button } from '../atoms/buttons/button.js';
import { classMap } from 'lit/directives/class-map.js';

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
        @click="${this.#handleClick}"
        class="${classMap({
          'opacity-50': this.isToggling,
        })} grid grid-cols-2 rounded-lg border-2 border-neutral-600 p-2 transition"
      >
        <a
          class="ms-2 inline-flex items-center text-lg font-bold text-white underline decoration-transparent transition hover:underline hover:decoration-white"
          href="${buildReportUrl(this.slug)}"
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
            () => html`<sme-badge class="flex items-center" slug="${ifDefined(this.slug)}"></sme-badge>`,
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
        @click="${this.#openRepositorySettings}"
        class="ml-2 rounded bg-blue-600 p-1 transition hover:bg-blue-700"
        title="Open repository settings"
        ?disabled="${this.isToggling}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
      <button
        @click="${this.#toggleRepository}"
        class="ml-2 rounded bg-red-600 p-1 transition hover:bg-red-700"
        title="Disable repository"
        ?disabled="${this.isToggling}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
        </svg>
      </button>
    `;
  }

  #renderWhenDisabled() {
    return html`
      <button
        @click="${this.#toggleRepository}"
        class="ml-2 rounded bg-green-600 p-1 transition hover:bg-green-700"
        title="Enable repository"
        ?disabled="${this.isToggling}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    `;
  }

  #openRepositorySettings() {
    console.log('foo');
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
