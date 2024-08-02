import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Router } from '@vaadin/router';

import './pages/home.page';
import './pages/report.page';
import './pages/repositories.page';

/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

@customElement('stryker-dashboard')
export class StrykerDashboard extends LitElement {

  
  override firstUpdated() {
    const router = new Router(this.shadowRoot!.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'stryker-dashboard-home-page' },
      { path: '/repos/:name', component: 'stryker-dashboard-repository-page' },
      { path: '/reports/*', component: 'stryker-dashboard-report-page' },
      { path: '(.*)', redirect: '/' },
    ]);
  }

  override render() {
    return html`
      <sme-top-bar>
        <sme-profile-button slot="right-side"></sme-profile-button>
      </sme-top-bar>
      <div id="outlet"></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard
  }
}
