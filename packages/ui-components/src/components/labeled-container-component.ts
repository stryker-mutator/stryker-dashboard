import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class LabeledContainerComponent extends BaseElement {
  @property({ type: String})
  title: string ='';

  render() {
    return html`
      <div class="flex justify-center content-center p-10">
        <div class="border-neutral-500/80 border-2 rounded hover:-translate-y-[1px]">
          <p class="text-xl font-semibold bg-neutral-500/80 text-neutral-100 p-1">${this.title}</p>
        <!-- <slot></slot> -->
        <div class="h-96 w-96 text-white bg-red-600/10">Dummy content</div>
        </div>
        
      </div>
    `;
  }
}
