import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class HeroButton extends BaseElement {
  @property()
  priority: 'primary' | 'secondary' = 'primary';
  @property()
  text = 'text';

  render() {
    const isPrimary = this.priority === 'primary';

    return html`
      <button
        class="${isPrimary
          ? 'text-white bg-red-800'
          : 'text-white bg-slate-800'} font-semibold px-6 py-1 rounded-md"
      >
        ${this.text}
      </button>
    `;
  }
}
