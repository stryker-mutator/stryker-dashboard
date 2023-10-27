import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class StatusBoxComponent extends BaseElement {
  @property({ type: Array })
  boxes: { value: string; label: string; color: string }[] = [
    { value: '1500+', label: 'projects onboarded', color: 'text-yellow-400' },
    { value: '78%', label: 'average score', color: 'text-green-600' },
    { value: '250', label: 'GitHub stars', color: 'text-yellow-400' },
  ];

  render() {
    return html`
      <div class="flex items-center justify-center bg-neutral-800 p-6">
        <div
          class="grid h-auto w-11/12 content-around justify-center py-16 md:flex md:h-full md:max-w-4xl md:justify-around"
        >
          ${this.boxes.map(
            ({ value, label, color }) => html`
              <div
                class="flex h-fit w-48 flex-col flex-nowrap items-center  border-b-2 border-neutral-600 px-0 py-16 duration-150 hover:shadow-sm max-md:last:border-none sm:w-52 md:rounded md:border-2 md:px-4 md:py-2 "
              >
                <p class="${color} text-6xl font-bold md:text-2xl lg:text-4xl">
                  ${value}
                </p>
                <p
                  class="whitespace-nowrap text-2xl font-bold text-gray-100 md:text-lg"
                >
                  ${label}
                </p>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
