import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { BaseElement } from '../base-element.js';

const finalBadgeUrl = 'https://img.shields.io/endpoint';
const exampleImageBaseUrl = 'https://img.shields.io/badge/mutation score';
const badgeStyles = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];
const badgeExamples = [
  `${exampleImageBaseUrl}-82.8%-green`,
  `${exampleImageBaseUrl}-65.1%-orange`,
  `${exampleImageBaseUrl}-45.6%-red`,
];

@customElement('sme-badge-configurator')
export class BadgeConfigurator extends BaseElement {
  @property()
  dashboardBadgeApiUrl = 'https://badge-api.stryker-mutator.io/';

  @property()
  dashboardReportUrl = 'https://dashboard.stryker-mutator.io/reports/';

  @property()
  projectName = 'github.com/stryker-mutator/stryker-js/master';

  @state()
  selectedStyle = 'flat';

  @state()
  isCopied = false;

  render() {
    return html`
      <div>
        <h3 class="mb-2 text-xl text-white">Choose from the following styles:</h3>
        <div class="mb-4">
          ${map(badgeStyles, (style) => this.#renderBadge(style))}
          <sme-button class="mt-2 block" .small="${true}" type="primary" @click="${this.#copyToClipboard}"
            >${this.isCopied ? 'Copied!' : 'Copy markdown'}</sme-button
          >
        </div>
      </div>
      <div>
        <h3 class="mb-2 text-xl text-white">Examples</h3>
        ${map(badgeExamples, (example) => this.#renderImage(encodeURI(`${example}?style=${this.selectedStyle}`)))}
      </div>
    `;
  }

  #renderImage(source: string) {
    return html`<img class="m-2 ms-0" src="${source}" />`;
  }

  #renderBadge(style: string) {
    return html`
      <div class="flex items-center">
        <input
          type="radio"
          id="${style}"
          name="style"
          value="${style}"
          ?checked="${this.selectedStyle === style}"
          @change="${() => (this.selectedStyle = style)}"
        />
        <label for="${style}" class="ml-2 text-white">${style}</label>
      </div>
    `;
  }

  async #copyToClipboard() {
    const badgeUrl = encodeURIComponent(`${this.dashboardBadgeApiUrl}${this.projectName}`);
    const reportUrl = `${this.dashboardReportUrl}${this.projectName}`;
    await navigator.clipboard.writeText(
      `[![Mutation testing badge](${finalBadgeUrl}?style=${this.selectedStyle}&url=${badgeUrl})](${reportUrl})`,
    );

    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-badge-configurator': BadgeConfigurator;
  }
}
