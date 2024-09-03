import { html } from 'lit';
import { BaseElement } from '../base-element';
import { when } from 'lit/directives/when.js';
import { customElement, property } from 'lit/decorators.js';

const COPY_RESET_TIMING = 2000;

@customElement('sme-copy-text')
export class CopyText extends BaseElement {
  @property({ type: Boolean, reflect: true })
  copiedText = false;

  render() {
    return html`
      <div class="inline-flex">
        <sme-text bold><slot></slot></sme-text>
        <button class="ms-1" @click="${this.#handleCopyText}">
          ${when(
            !this.copiedText,
            () =>
              html`<svg
                class="size-5 stroke-white stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>`,
            () => html`
              <svg
                class="size-5 stroke-green-500 stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            `,
          )}
        </button>
      </div>
    `;
  }

  #handleCopyText() {
    if (!navigator?.clipboard?.writeText) {
      console.warn('Clipboard API is not supported');
      return;
    }

    navigator.clipboard.writeText(this.innerText ?? 'text could not be copied...');
    this.copiedText = true;

    setTimeout(() => {
      this.copiedText = false;
    }, COPY_RESET_TIMING);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-copy-text': CopyText;
  }
}
