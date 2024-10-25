import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('stryker-dashboard-home-page')
export class HomePage extends LitElement {
  override createRenderRoot() {
    return this;
  }

  override render() {
    const supportedFrameworks = [
      {
        name: 'StrykerJS',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://stryker-mutator.io/docs/stryker-js/introduction/',
      },
      {
        name: 'Stryker.NET',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://stryker-mutator.io/docs/stryker-net/introduction/',
      },
      {
        name: 'Stryker4s',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://stryker-mutator.io/docs/stryker4s/getting-started/',
      },
      {
        name: 'Infection',
        logo: './assets/infection-logo.png',
        url: 'https://infection.github.io/',
      },
    ];

    return html`
      <sme-hero></sme-hero>
      <sme-stryker-dashboard-explanation></sme-stryker-dashboard-explanation>
      <sme-getting-started-overview id="getting-started"></sme-getting-started-overview>
      <sme-supported-framework-list .supportedFrameworks=${supportedFrameworks}></sme-supported-framework-list>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-home-page': HomePage;
  }
}
