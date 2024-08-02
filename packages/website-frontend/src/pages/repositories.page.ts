import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('stryker-dashboard-repositories-page')
export class RepositoriesPage extends LitElement {
    override render() {
        return html `
      <sme-top-bar>
        <sme-profile-button slot="right-side"></sme-profile-button>
      </sme-top-bar>
      <mutation-test-report-app></mutation-test-report-app>
    `;
    }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-repositories-page': RepositoriesPage
  }
}
