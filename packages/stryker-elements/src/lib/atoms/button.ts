import { BaseElement } from '../base-element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class Button extends BaseElement {
  @property({ attribute: true })
  align: 'left' | 'right' | 'middle' = 'middle';

  render() {
    const classes = classMap({
      'box-border h-10 rounded-lg border-2 border-solid border-white bg-neutral-800 p-2 pl-2 pr-2 font-bold':
        !this.unStyled,
      'justify-middle': this.align === 'middle',
      'justify-start': this.align === 'left',
      'justify-end': this.align === 'right',
    });

    return html`<button class="${classes} flex h-full w-full items-center">
      <slot></slot>
    </button>`;
  }
}
