import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element';

@customElement('sme-hr')
export class Hr extends BaseElement {
  @property()
  direction: 'horizontal' | 'vertical' = 'horizontal';

  @property()
  color: 'normal' | 'bright' = 'normal';

  render() {
    const color = classMap({ 'bg-neutral-700': this.color === 'normal', 'bg-neutral-400': this.color === 'bright' });

    if (this.direction === 'vertical') {
      return html`<hr class="${color} h-full w-[3px] rounded" />`;
    }

    return html`<hr class="${color} my-2 rounded border-t-[3px]" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-hr': Hr;
  }
}
