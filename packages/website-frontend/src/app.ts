import { Router } from '@vaadin/router';
import { Login } from '@stryker-mutator/dashboard-contract';
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { baseUrl } from './contract/constants';
import { authService, AuthService } from './services/auth.service';

import './pages/auth.page';
import './pages/home.page';
import './pages/report.page';
import './pages/repositories.page';

/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

@customElement('stryker-dashboard')
export class StrykerDashboard extends LitElement {
  #authService: AuthService
  #router: Router | null;
  
  @state()
  user: Login | null;

  constructor() {
    super();
    
    this.#authService = authService;
    this.#router = null;

    this.user = null;
  }

  protected override firstUpdated(): void {
    
    this.#router = new Router(this.shadowRoot!.querySelector('#outlet'));
    this.#router.setRoutes([
      { path: '/', component: 'stryker-dashboard-home-page' },
      { path: '/repos/:name', component: 'stryker-dashboard-repository-page' },
      { path: '/reports/*', component: 'stryker-dashboard-report-page' },
      { path: '/auth/github/callback', component: 'stryker-dashboard-auth-page' },
      { path: '(.*)', redirect: '/' },
    ]);

    this.#authService.getUser()
      .then((user) => {
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
      return html`
        <sme-profile-button
          @sign-out="${this.#signOut}"
          avatarUrl="${this.user.avatarUrl}" 
          name="${this.user.name}" 
          slot="right-side">
        </sme-profile-button>`;
    }
    
    return html`
      <sme-button
        @click="${this.#signIn}"
        type="subtle" 
        slot="right-side">
        Sign in with GitHub
      </sme-link>`;
  }

  #signIn() {
    window.location.href = `${baseUrl}/api/auth/github`;
  }

  #signOut() {
    this.#authService.signOut();
    window.location.reload();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard
  }
}
