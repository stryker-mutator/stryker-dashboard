import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class Button extends BaseElement {
  @property()
  type: 'primary' | 'secondary' = 'primary';

  render() {
    const isPrimary = this.type === 'primary';

    return html`
      <button
        class="${isPrimary
          ? 'text-white bg-red-800'
          : 'text-white bg-slate-800'} text-l h-11 rounded-md px-6 py-1 font-bold"
      >
        <slot></slot>
      </button>
    `;
  }
}
