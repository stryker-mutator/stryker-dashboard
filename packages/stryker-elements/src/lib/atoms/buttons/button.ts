import { BaseElement } from '../../base-element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type ButtonType = 'plain' | 'primary' | 'secondary' | 'subtle';

const ButtonStyles = {
  plain: '',
  primary: 'bg-red-800 text-white font-bold',
  secondary: '',
  subtle: 'box-border h-10 border-2 border-solid border-white bg-neutral-800 font-bold',
};

export class Button extends BaseElement {
  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  @property() 
  small = false;

  @property()
  type: ButtonType = 'primary';

  render() {
    const classes = classMap({
      'justify-center': this.align === 'middle',
      'justify-start': this.align === 'left',
      'justify-end': this.align === 'right',
      [ButtonStyles[this.type]]: true,
      'w-full': !this.small,
    });

    return html`<button class="${classes} flex h-full items-center rounded-lg p-2">
      <slot></slot>
    </button>`;
  }
}
