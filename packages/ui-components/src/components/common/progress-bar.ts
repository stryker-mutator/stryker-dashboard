import { BaseElement } from '../../base';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

export class ProgressBar extends BaseElement {
  @property({ type: Number })
  currentStep = 0;

  @property({ type: Number })
  totalSteps = 1;

  @property({ type: Boolean })
  hideProgressText = false;

  @property({ type: Boolean })
  hideProgressBar = false;

  thresholdLow = 60;
  thresholdHigh = 80;

  backgroundColors: { [index: number]: string } = {
    0: 'bg-red-600',
    1: 'bg-yellow-400',
    2: 'bg-green-600',
  };
  textColors: { [index: number]: string } = {
    0: 'text-red-600',
    1: 'text-yellow-400',
    2: 'text-green-600',
  };

  getIndex(): number {
    if (this.currentStep / this.totalSteps <= this.thresholdLow / 100) {
      return 0;
    } else if (
      this.currentStep / this.totalSteps > this.thresholdLow / 100 &&
      this.currentStep / this.totalSteps <= this.thresholdHigh / 100
    ) {
      return 1;
    } else {
      return 2;
    }
  }

  render() {
    const progressText = html`
      <span
        class="font-bold ${this.textColors[this.getIndex()]} 
          ${this.hideProgressBar ? '' : 'pr-3'}"
        ?hidden="${this.hideProgressText}"
      >
        ${Math.round((this.currentStep / this.totalSteps) * 1000) / 10}%
      </span>
    `;
    const progressBar = html`
      <div
        class="bg-neutral-600 rounded-full h-4 w-full"
        ?hidden="${this.hideProgressBar}"
      >
        <div
          class="${this.backgroundColors[this.getIndex()]} rounded-full h-4"
          style="width:${(this.currentStep / this.totalSteps) * 100}%"
        ></div>
      </div>
    `;

    return html`
      <div class="${this.hideProgressText ? 'grid items-center h-full' : ''}">
        <div
          class="w-full"
          class="${this.hideProgressText ? '' : 'flex space-y-1'}"
        >
          ${!this.hideProgressText ? progressText : nothing}
          ${!this.hideProgressBar ? progressBar : nothing}
        </div>
      </div>
    `;
  }
}
