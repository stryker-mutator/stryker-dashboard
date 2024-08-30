import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-progress-bar')
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
        class="${classMap({
          'pr-3': !this.hideProgressBar,
          [this.textColors[this.getIndex()]]: true,
        })} font-bold"
        ?hidden="${this.hideProgressText}"
      >
        ${Math.round((this.currentStep / this.totalSteps) * 1000) / 10}%
      </span>
    `;

    const progressBar = html`
      <div class="h-4 w-full rounded-full bg-neutral-600" ?hidden="${this.hideProgressBar}">
        <div
          class="${this.backgroundColors[this.getIndex()]} h-4 rounded-full"
          style="${styleMap({
            width: `${(this.currentStep / this.totalSteps) * 100}%`,
          })}"
        ></div>
      </div>
    `;

    return html`
      <div class="${this.hideProgressText ? 'grid items-center h-full' : ''}">
        <div
          class="${classMap({
            'flex space-y-1': !this.hideProgressText,
          })} w-full"
        >
          ${!this.hideProgressText ? progressText : nothing}
          ${!this.hideProgressBar ? progressBar : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'progress-bar': ProgressBar;
  }
}
