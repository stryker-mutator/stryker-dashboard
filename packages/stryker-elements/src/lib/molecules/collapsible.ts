import '../atoms/title.js';

import type { PropertyValues } from 'lit';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';

@customElement('sme-collapsible')
export class Collapsible extends BaseElement {
  @property()
  title = '';

  @property({ type: Boolean, reflect: true })
  opened = false;

  @query('#content')
  declare private content: HTMLDivElement | undefined;

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    // If the component starts with opened=true, we need to render a second time to measure the content height
    if (changedProperties.has('opened') && this.opened) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <div class="rounded-lg bg-neutral-600">
        <button
          class="flex w-full p-4"
          @click="${this.#handleClick}"
          id="header"
          aria-controls="content"
          aria-expanded="${this.opened}"
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
          style="max-height: ${this.opened && this.content ? this.content.scrollHeight : 0}px"
          class="overflow-hidden transition-all"
          id="content"
          aria-hidden="${!this.opened}"
          aria-labelledby="header"
        >
          <div class="m-4 mt-0">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  #handleClick() {
    this.opened = !this.opened;
  }
}
