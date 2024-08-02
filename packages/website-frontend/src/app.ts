import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { Router } from '@vaadin/router';
import {
  Login,
} from '@stryker-mutator/dashboard-contract';

import { AuthService, TheAuthService } from './services/auth.service';

import './pages/auth.page';
import './pages/home.page';
import './pages/report.page';
import './pages/repositories.page';

/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

@customElement('stryker-dashboard')
export class StrykerDashboard extends LitElement {
  #authService: AuthService
  
  @state()
  isCopied = false;

  @state()
  user: Login | null;

  constructor() {
    super();
    
    this.#authService = TheAuthService;
    this.user = null;
  }

  protected override firstUpdated(): void {
    
    const router = new Router(this.shadowRoot!.querySelector('#outlet'));
  
    router.setRoutes([
      { path: '/', component: 'stryker-dashboard-home-page' },
      { path: '/repos/:name', component: 'stryker-dashboard-repository-page' },
      { path: '/reports/*', component: 'stryker-dashboard-report-page' },
      { path: '/auth/github/callback', component: 'stryker-dashboard-auth-page' },
      { path: '(.*)', redirect: '/' },
    ]);

    this.#authService.getUser().then((user) => {
      this.user = user;
    });
  }

  override render() {
    return html`
      <sme-top-bar logoUrl="https://stryker-mutator.io/images/stryker.svg">
        ${this.#renderProfileButtonOrSignInButton()}
      </sme-top-bar>
      <div id="outlet"></div>
    `;
  }

  #renderProfileButtonOrSignInButton() {
    if (this.user !== null) {
      return html`<sme-profile-button avatarUrl="${this.user.avatarUrl}" name="${this.user.name}" slot="right-side"></sme-profile-button>`;
    }
    return html`<sme-link href="http://localhost:1337/api/auth/github" slot="right-side" router-ignore>Sign in with GitHub</sme-link>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard
  }
}
