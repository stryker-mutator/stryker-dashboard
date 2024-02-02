import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element.js';
import { html } from 'lit';

import '../../exports/lib/atoms/progress-bar';

export class Repository extends BaseElement {
  @property({ type: String })
  name = '';

  @property({ type: Number })
  mutationScore = 0;

  @property({ type: Number })
  totalSteps = 100;

  render() {
    return html`
      <div class="grid grid-cols-3 rounded-lg border-2 border-neutral-600 p-4">
        <span class="col-span-1 text-white">${this.name}</span>
        <progress-bar
          class="col-span-2"
          currentStep="${this.mutationScore}"
          totalSteps="${this.totalSteps}"
        ></progress-bar>
      </div>
    `;
  }
}
