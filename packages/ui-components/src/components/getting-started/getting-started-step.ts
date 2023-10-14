import { property } from 'lit/decorators.js';
import { BaseElement } from '../../base';
import { html } from 'lit';

export class GettingStartedStep extends BaseElement {
  @property({ type: String })
  title = '';

  render() {
    console.log(this.title);

    return html`
      <div class="getting-started-step text-white block">
        <h2 class="font-bold text-3xl mb-4">${this.title}</h2>
        <div class="text-2xl rounded-lg border-2 border-neutral-600 p-4">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
