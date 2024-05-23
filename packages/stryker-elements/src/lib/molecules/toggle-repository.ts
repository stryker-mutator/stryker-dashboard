import { BaseElement } from '../base-element.js';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class ToggleRepository extends BaseElement {
  @property()
  name = '';

  @property()
  slug = '';

  @property()
  enabled = false;

  @property()
  apiKey: string = '';

  @property()
  loading = false;

  @state()
  hasCopied = false;

  render() {
    return html`
      <div
        class="${classMap({
          'animate-pulse': this.loading,
        })}grid grid-cols-2 rounded-lg border-2 border-neutral-600 p-3"
      >
        <span class="font-bold text-white">${this.name}</span>
        ${this.#apiKeyCopiedOrNoApiKeyAvailable()
          ? this.#renderToggleButton()
          : this.#renderApiKey()}
      </div>
    `;
  }

  #apiKeyCopiedOrNoApiKeyAvailable() {
    return this.apiKey === '' || this.hasCopied;
  }

  #renderToggleButton() {
    return html` <div class="flex">
      <sme-toggle-button
        class="ms-auto flex"
        .checked="${this.enabled}"
        @stateChanged="${this.#toggleRepository}"
      />
    </div>`;
  }

  #renderApiKey() {
    return html` <div class="align-content-center flex">
      <p class="ms-auto font-bold">
        ${this.apiKey}<span class="ms-2 cursor-pointer" @click="${this.#copyApiKeyToClipboard}"
          >📋</span
        >
      </p>
    </div>`;
  }

  #copyApiKeyToClipboard() {
    window.navigator.clipboard.writeText(this.apiKey!);
    this.hasCopied = true;
    this.apiKey = '';
  }

  #toggleRepository(event: CustomEvent) {
    if (event.detail.checked) {
      this.apiKey = '';
      this.hasCopied = false;
    }

    this.loading = true;
    this.dispatchEvent(
      new CustomEvent('repositoryToggled', {
        detail: {
          slug: this.slug,
          checked: event.detail.checked,
        },
      }),
    );
  }
}
