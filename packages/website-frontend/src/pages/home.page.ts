import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('stryker-dashboard-home-page')
export class HomePage extends LitElement {
  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`
      <sme-hero></sme-hero>
      <sme-stryker-dashboard-explanation></sme-stryker-dashboard-explanation>
      <sme-getting-started-overview id="getting-started"></sme-getting-started-overview>
      <sme-supported-framework-list></sme-supported-framework-list>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-home-page': HomePage;
  }
}
