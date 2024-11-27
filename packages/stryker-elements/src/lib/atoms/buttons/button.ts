import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../../base-element';

export type ButtonPadding = 'square' | 'rectangle';
export type ButtonType = 'plain' | 'primary' | 'subtle';

const BUTTON_STYLES = {
  plain: '',
  primary: 'bg-red-800 hover:bg-red-900 text-white font-bold',
  subtle: 'box-border h-10 border-2 border-solid border-white bg-neutral-800 font-bold',
};

const BUTTON_PADDING = {
  square: 'p2',
  rectangle: 'py-2 px-5',
};

@customElement('sme-button')
export class Button extends BaseElement {
  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  @property({ attribute: 'padding' })
  padding: ButtonPadding = 'square';

  @property({ type: Boolean })
  small = false;

  @property()
  type: ButtonType = 'primary';

  render() {
    const classes = classMap({
      'justify-center': this.align === 'middle',
      'justify-start': this.align === 'left',
      'justify-end': this.align === 'right',
      [BUTTON_STYLES[this.type]]: true,
      [BUTTON_PADDING[this.padding]]: true,
      'w-full': !this.small,
    });

    return html`<button class="${classes} flex h-full items-center rounded-lg p-2 transition duration-150">
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-button': Button;
  }
}
