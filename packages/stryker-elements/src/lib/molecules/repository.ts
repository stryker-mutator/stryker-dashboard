import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { html } from 'lit';

import '../../exports/lib/atoms/progress-bar';

export class Repository extends BaseElement {
  @property({ type: String })
  name = '';

  @property({ type: Number })
  currentStep = 907;

  @property({ type: Number })
  totalSteps = 1000;

  render() {
    return html`
      <div class="grid grid-cols-3 rounded-lg border-2 border-neutral-600 p-4">
        <span class="col-span-1 text-white">${this.name}</span>
        <progress-bar
          class="col-span-2"
          currentStep="${this.currentStep}"
          totalSteps="${this.totalSteps}"
        ></progress-bar>
      </div>
    `;
  }
}
