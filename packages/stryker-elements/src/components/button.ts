import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class Button extends BaseElement {
  @property()
  type: 'primary' | 'secondary' = 'primary';

  render() {
    return html`
      <button
        class="${classMap({
          'text-white bg-red-800': this.type === 'primary',
          'text-white bg-slate-800': this.type !== 'primary',
        })} text-l h-11 rounded-md px-6 py-1 font-bold"
      >
        <slot></slot>
      </button>
    `;
  }
}
