import { property } from 'lit/decorators.js';
import { BaseElement } from '../../base';
import { html } from 'lit';

export class GettingStartedStep extends BaseElement {
  @property({ type: String })
  title = '';

  render() {
    return html`
      <div class="block text-white">
        <h2 class="mb-4 text-xl font-bold">${this.title}</h2>
        <div class="rounded-lg border-2 border-neutral-600 p-4">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
