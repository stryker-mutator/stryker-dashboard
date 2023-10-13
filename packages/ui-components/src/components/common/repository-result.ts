import '../../exports/common/progress-bar';
import { BaseElement } from '../../base';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

export class RepositoryResult extends BaseElement {
  @property({ type: String })
  repositoryName = 'your-repository';

  render() {
    return html`
      <h2 class="font-bold text-3xl mb-2 text-white mb-3">
        🔍 View your results
      </h2>
      <div class="grid grid-cols-3 border-2 p-4 rounded-lg border-neutral-600">
        <span class="text-white col-span-1">${this.repositoryName}</span>
        <progress-bar
          class="col-span-2"
          currentStep="907"
          totalSteps="1000"
        ></progress-bar>
      </div>
    `;
  }
}
