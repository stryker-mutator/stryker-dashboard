import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class Button extends BaseElement {
  @property()
  priority: 'primary' | 'secondary' = 'primary';

  render() {
    const isPrimary = this.priority === 'primary';

    return html`
      <button
        class="${isPrimary
          ? 'text-white bg-red-800'
          : 'text-white bg-slate-800'} text-l font-bold px-6 py-1 rounded-md h-11"
      >
        <slot></slot>
      </button>
    `;
  }
}
