import '../atoms/title.js';

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element.ts';

@customElement('sme-collapsible')
export class Collapsible extends BaseElement {
  @property()
  title = '';

  @property({ type: Boolean, reflect: true })
  opened = false;

  render() {
    return html`
      <div class="rounded-lg bg-zinc-600">
        <button
          class="flex w-full p-4"
          @click=${this.#handleClick}
          id="header"
          aria-controls="content"
          aria-expanded=${this.opened}
        >
          <sme-title textSize="large" alignLeft noMargin>${this.title}</sme-title>
          <div class="ms-auto flex items-center pe-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              class="${classMap({
                'rotate-180': this.opened,
              })} size-6 stroke-white stroke-2 transition"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </div>
        </button>
        <div
          class="${classMap({
            'grid-rows-[1fr]': this.opened,
            'grid-rows-[0fr]': !this.opened,
          })} grid transition-all"
          id="content"
          aria-hidden=${!this.opened}
          aria-labelledby="header"
        >
          <div class="overflow-hidden">
            <div class="m-4 mt-0">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  #handleClick() {
    this.opened = !this.opened;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-collapsible': Collapsible;
  }
}
