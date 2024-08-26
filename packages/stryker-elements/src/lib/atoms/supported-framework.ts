import { html } from 'lit';
import { BaseElement } from '../base-element.js';
import { property } from 'lit/decorators.js';

export type SupportedFrameworkProperties = {
  name: string;
  logo: string;
  url: string;
};

export class SupportedFramework extends BaseElement {
  @property({ type: String })
  name: string = '';

  @property({ type: String })
  logo: string = '';

  @property({ type: String })
  url: string = '';

  render() {
    return html`
      <a href="${this.url}" target="_blank" class="grid w-20 grid-cols-1 gap-1 grayscale">
        <img class="h-16 place-self-center" src="${this.logo}" alt="${this.name} logo" />
        <span class="text-center font-bold text-white">${this.name}</span>
      </a>
    `;
  }
}
