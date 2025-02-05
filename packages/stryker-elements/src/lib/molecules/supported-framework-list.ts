import '../atoms/supported-framework';

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { SupportedFrameworkProps } from '../atoms/supported-framework';
import { BaseElement } from '../base-element';

@customElement('sme-supported-framework-list')
export class SupportedFrameworkList extends BaseElement {
  @property({ type: Array })
  supportedFrameworks: SupportedFrameworkProps[] = [];

  @property()
  spacing: 'around' | 'between' = 'around';

  render() {
    const classes = classMap({
      'justify-around': this.spacing === 'around',
      'justify-between': this.spacing === 'between',
    });
    return html`
      <div class="bg-zinc-900/50 p-8">
        <h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2>
        <sme-spatious-layout>
          <div class="${classes} flex">
            ${this.supportedFrameworks.map(
              (framework) => html`
                <sme-supported-framework
                  name="${framework.name}"
                  logo="${framework.logo}"
                  url="${framework.url}"
                ></sme-supported-framework>
              `,
            )}
          </div>
        </sme-spatious-layout>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-supported-framework-list': SupportedFrameworkList;
  }
}
