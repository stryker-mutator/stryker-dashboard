import '../../exports/common/progress-bar';
import { BaseElement } from '../../base';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

export class RepositoryResult extends BaseElement {
  @property({ type: String })
  repositoryName = '';
  @property({ type: Number })
  currentStep = 907;
  @property({ type: Number })
  totalSteps = 1000;

  render() {
    return html`
      <h2 class="font-bold text-3xl mb-3 text-white">🔍 View your results</h2>
      <div class="grid grid-cols-3 border-2 p-4 rounded-lg border-neutral-600">
        <span class="text-white col-span-1">${this.repositoryName}</span>
        <progress-bar
          class="col-span-2"
          currentStep="${this.currentStep}"
          totalSteps="${this.totalSteps}"
        ></progress-bar>
      </div>
    `;
  }
}
