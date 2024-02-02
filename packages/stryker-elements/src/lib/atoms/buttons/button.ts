import { BaseElement } from '../../base-element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export const buttonTypes = {
  plain: '',
  primary: 'bg-red-800 text-white font-bold',
  secondary: '',
  subtle:
    'box-border h-10  border-2 border-solid border-white bg-neutral-800 font-bold',
};

export class Button extends BaseElement {
  @property()
  type = buttonTypes.primary;

  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  render() {
    const classes = classMap({
      'justify-center': this.align === 'middle',
      'justify-start': this.align === 'left',
      'justify-end': this.align === 'right',
      [this.type]: true,
    });

    return html`<button
      class="${classes} flex h-full w-full items-center rounded-lg  p-2"
    >
      <slot></slot>
    </button>`;
  }
}
