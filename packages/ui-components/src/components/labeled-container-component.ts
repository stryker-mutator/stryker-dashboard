import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class LabeledContainerComponent extends BaseElement {
  @property({ type: String })
  label: string = '';

  render() {
    return html`
      <div class="border-neutral-600 border-2 rounded">
        <p class="text-l font-semibold bg-neutral-600 text-neutral-100 p-1 cursor-default">${this.label}</p>
        <slot></slot>
      </div>
    `;
  }
}
