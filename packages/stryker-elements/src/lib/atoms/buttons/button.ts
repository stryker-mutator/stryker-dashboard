import { BaseElement } from '../../base-element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ButtonPadding = 'square' | 'rectangle';
export type ButtonType = 'plain' | 'primary' | 'secondary' | 'subtle';

const BUTTON_STYLES = {
  plain: '',
  primary: 'bg-red-800 text-white font-bold',
  secondary: '',
  subtle: 'box-border h-10 border-2 border-solid border-white bg-neutral-800 font-bold',
};

const BUTTON_PADDING = {
  square: 'p2',
  rectangle: 'py-2 px-5',
};

export class Button extends BaseElement {
  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  @property({ attribute: 'padding' })
  padding: ButtonPadding = 'square';

  @property()
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

    return html`<button class="${classes} flex h-full items-center rounded-lg p-2">
      <slot></slot>
    </button>`;
  }
}
