import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { html } from 'lit';

export interface SupportedFrameworkProps {
  name: string;
  logo: string;
  url: string;
}

@customElement('sme-supported-framework')
export class SupportedFramework extends BaseElement {
  @property({ type: String })
  name = '';

  @property({ type: String })
  logo = '';

  @property({ type: String })
  url = '';

  render() {
    return html`
      <a href="${this.url}" target="_blank" class="grid w-20 grid-cols-1 gap-1">
        <img class="h-16 place-self-center rounded" src="${this.logo}" alt="${this.name} logo" />
        <span class="text-center font-bold text-white">${this.name}</span>
      </a>
    `;
  }
}
