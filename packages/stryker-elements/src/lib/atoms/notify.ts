import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element.js';
import { html } from 'lit';

export class Notify extends BaseElement {
  @property({ type: String })
  message = '';

  render() {
    return html`
      <div class="rounded border-2 border-red-600 bg-red-800/50 p-4">
        <p class="font-bold text-white">${this.message}</p>
      </div>
    `;
  }
}
