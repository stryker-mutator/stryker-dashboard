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
        <div class="font-bold text-3xl mb-2">${this.title}</div>
        <div class="rounded-lg text-2xl bg-neutral-600 p-4">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
