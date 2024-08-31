import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element.js';

type NotifyType = 'error' | 'info';

@customElement('sme-notify')
export class Notify extends BaseElement {
  @property()
  type: NotifyType = 'error';

  render() {
    const classes = classMap({
      'border-red-600 bg-red-800/50': this.type === 'error',
      'border-cyan-600 bg-cyan-800/50': this.type === 'info',
    });

    return html`
      <div class="${classes} rounded-lg border-2 p-4">
        <p class="font-bold text-white"><slot></slot></p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-notify': Notify;
  }
}
