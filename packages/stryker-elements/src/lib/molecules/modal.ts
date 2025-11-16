import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

export const MODAL_OPEN_EVENT = 'modal-open';
export const MODAL_CLOSED_EVENT = 'modal-close';

@customElement('sme-modal')
export class Modal extends BaseElement {
  @property()
  title = '';

  @query('dialog')
  declare private dialog: HTMLDialogElement;

  get isOpen() {
    return this.dialog.open ?? false;
  }

  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener(MODAL_OPEN_EVENT, this.open);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(MODAL_OPEN_EVENT, this.open);
  }

  open = () => {
    this.dialog.showModal();
  };

  close = () => {
    this.dialog.close();
  };

  render() {
    return html`
      <dialog
        @click="${this.close}"
        @close="${this.#handleClose}"
        class="m-auto h-full max-h-192 w-xl rounded bg-zinc-800 p-6 opacity-0 transition-[opacity,display,background-color,overlay] transition-discrete duration-300 backdrop:bg-transparent backdrop:transition-all backdrop:duration-300 open:opacity-100 open:backdrop:bg-black/50 lg:w-3xl starting:open:opacity-0 starting:open:backdrop:bg-black/0"
      >
        <div @click="${(e: Event) => e.stopPropagation()}" class="flex h-full w-full flex-col">
          <h2 class="text-3xl text-white">${this.title}</h2>
          <sme-hr></sme-hr>
          <div class="grid max-h-fit gap-4 overflow-auto pt-6">
            <slot></slot>
          </div>
          <div class="mt-auto flex pt-6">
            <sme-button class="ms-auto" @click="${this.close}">Close</sme-button>
          </div>
        </div>
      </dialog>
    `;
  }

  #handleClose() {
    this.dispatchEvent(new CustomEvent(MODAL_CLOSED_EVENT));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-modal': Modal;
  }
}
