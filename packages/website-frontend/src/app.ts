import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

@customElement('stryker-dashboard')
export class StrykerDashboard extends LitElement {
  override render() {
    return html`
      <sme-hero></sme-hero>
      <sme-stryker-dashboard-explanation></sme-stryker-dashboard-explanation>
      <sme-spatious-layout>
        <sme-getting-started-overview id="getting-started"></sme-getting-started-overview>
      </sme-spatious-layout>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard
  }
}
