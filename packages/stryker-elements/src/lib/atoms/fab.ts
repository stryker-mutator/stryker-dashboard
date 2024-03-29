import { html } from 'lit';
import { BaseElement } from '../base-element.js';
import { property } from 'lit/decorators.js';

export class FAB extends BaseElement {
  @property({ type: String })
  icon: 'chevron-left' | 'chevron-right' = 'chevron-left';

  chevronLeft = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="inline-block h-6 w-6"
    id="chevron-left"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>`;
  chevronRight = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="h-6 w-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>`;

  render() {
    const iconMap = {
      'chevron-left': this.chevronLeft,
      'chevron-right': this.chevronRight,
    };

    return html`<button
      class="grid h-10 w-10 place-items-center rounded-full bg-neutral-600 text-white"
    >
      ${iconMap[this.icon]}
    </button>`;
  }
}
