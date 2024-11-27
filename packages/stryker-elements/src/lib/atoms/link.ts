import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { BaseElement } from '../base-element';

@customElement('sme-link')
export class Link extends BaseElement {
  @property({ type: Boolean })
  primary = false;

  @property({ type: Boolean })
  secondary = false;

  @property({ attribute: true })
  href?: string;

  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  @property({ type: Boolean, reflect: true })
  inline = false;

  render() {
    const classes = classMap({
      'bg-red-800': this.primary && !this.unStyled,
      'bg-slate-800': this.secondary && !this.unStyled,
      'text-l h-11 rounded-md px-6 py-3 font-bold text-white': !this.unStyled,
      'justify-center': this.align === 'middle',
      'justify-start': this.align === 'left',
      'justify-end': this.align === 'right',
      'h-full w-full flex items-center': !this.inline,
    });

    return html`
      <a class="${classes}" href="${ifDefined(this.href)}">
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-link': Link;
  }
}
