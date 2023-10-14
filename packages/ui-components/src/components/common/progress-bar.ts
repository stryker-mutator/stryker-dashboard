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

  tresholdLow = 60;
  tresholdHight = 80;

  getColor() {
    if (this.currentStep / this.totalSteps <= this.tresholdLow / 100) {
      return 'red-600';
    } else if (
      this.currentStep / this.totalSteps > this.tresholdLow / 100 &&
      this.currentStep / this.totalSteps <= this.tresholdHight / 100
    ) {
      return 'yellow-400';
    } else {
      return 'green-600';
    }
  }

  render() {
    const progressText = html`
      <span
        class="font-bold text-${this.getColor()} ${this.hideProgressBar
          ? ''
          : 'pr-3'}"
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
          class="bg-${this.getColor()} rounded-full h-4"
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
