import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';

@customElement('sme-collapsible')
export class Collapsible extends BaseElement {
  @property()
  title = '';

  @property({ type: Boolean, reflect: true })
  opened = false;

  render() {
    return html`
      <div class="rounded-lg bg-neutral-600 p-4">
        <button class="flex w-full" @click="${this.#handleClick}">
          <sme-title textSize="large" alignLeft noMargin>${this.title}</sme-title>
          <div class="ms-auto flex items-center pe-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              class="${classMap({
                'rotate-180': this.opened,
              })} size-6 stroke-white stroke-2 transition"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </div>
        </button>
        <div class="${classMap({ hidden: !this.opened })} mt-3 transition-all">
          <slot></slot>
        </div>
      </div>
    `;
  }

  #handleClick() {
    this.opened = !this.opened;
  }
}
