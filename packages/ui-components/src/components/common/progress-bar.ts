import { BaseElement } from '../../base';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

export class ProgressBar extends BaseElement {
  @property({ type: Number })
  currentStep = 0;
  @property({ type: Number })
  totalSteps = 1;

  render() {
    return html`
      <div class="flex w-full space-y-1">
        <span class="font-bold text-green-600 pr-3">
          ${Math.round((this.currentStep / this.totalSteps) * 1000) / 10}%
        </span>
        <div class="bg-neutral-600 rounded-full h-4 w-full">
          <div
            class="bg-green-600 rounded-full h-4"
            style="width:${(this.currentStep / this.totalSteps) * 100}%"
          ></div>
        </div>
      </div>
    `;
  }
}
