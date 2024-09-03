import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element.js';

export const MODAL_OPEN_EVENT = 'modal-open';
export const MODAL_CLOSED_EVENT = 'modal-close';

@customElement('sme-modal')
export class Modal extends BaseElement {
  @property()
  title = '';

  @state()
  isOpen = false;

  @state()
  isAnimating = false;

  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener(MODAL_OPEN_EVENT, () => {
      this.isOpen = !this.isOpen;
      setTimeout(() => (this.isAnimating = true), 100);
    });
  }

  render() {
    if (!this.isOpen) {
      return nothing;
    }

    const animationClasses = classMap({
      'opacity-0': !this.isAnimating,
      'opacity-100': this.isAnimating,
    });
    return html`
      <div
        class="${animationClasses} fixed top-0 z-30 flex h-full w-full items-center justify-center bg-black/50 p-2 transition duration-300"
      >
        <div class="flex h-full max-h-[48rem] w-[36rem] flex-col rounded bg-neutral-800 p-6 lg:w-[48rem]">
          <h2 class="text-3xl text-white">${this.title}</h2>
          <sme-hr></sme-hr>
          <div class="grid max-h-fit gap-4 overflow-auto pt-6">
            <slot></slot>
          </div>
          <div class="mt-auto flex pt-6">
            <sme-button class="ms-auto" @click="${this.#handleClose}">Close</sme-button>
          </div>
        </div>
      </div>
    `;
  }

  #handleClose() {
    this.isAnimating = false;

    setTimeout(() => (this.isOpen = false), 300);

    document.dispatchEvent(new Event(MODAL_CLOSED_EVENT));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-modal': Modal;
  }
}
