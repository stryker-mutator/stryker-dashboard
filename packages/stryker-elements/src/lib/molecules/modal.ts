import { html } from 'lit';
import { BaseElement } from '../base-element.js';
import { property, state } from 'lit/decorators.js';

export class Modal extends BaseElement {
  @property()
  title = '';

  @property()
  eventName = '';

  @state()
  isOpen = false;

  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener(this.eventName, () => {
      this.isOpen = !this.isOpen;
    });
  }

  render() {
    if (!this.isOpen) {
      return html``;
    }

    return html`
      <div
        class="fixed top-0 z-30 flex h-full w-full items-center justify-center bg-black/50 p-2"
      >
        <div
          class="flex h-full max-h-[48rem] w-[36rem] flex-col rounded bg-neutral-800 p-6 lg:w-[48rem]"
        >
          <h2 class="text-3xl text-white">${this.title}</h2>
          <sme-hr></sme-hr>
          <div class="grid max-h-fit gap-4 overflow-auto pt-6">
            <slot></slot>
          </div>
          <div class="mt-auto flex pt-6">
            <sme-button class="ms-auto" @click="${() => (this.isOpen = false)}"
              >Close</sme-button
            >
          </div>
        </div>
      </div>
    `;
  }
}
