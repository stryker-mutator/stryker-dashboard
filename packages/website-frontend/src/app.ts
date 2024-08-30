import { Router } from '@vaadin/router';
import { Login } from '@stryker-mutator/dashboard-contract';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { authService, AuthService } from './services/auth.service';
import { locationService } from './services/location.service';

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
  done = false;

  @state()
  user: Login | null;

  constructor() {
    super();

    this.#authService = authService;
    this.#router = null;

    this.user = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#authService.getUser()
      .then((user) => {
        this.user = user;
        this.#configureRouting();
        this.done = true;
      });
  }

  override createRenderRoot() {
    return this;
  }

  #configureRouting() {
    this.#router = new Router(this.querySelector('#outlet'));
    this.#router.setRoutes([
      { path: '/', component: 'stryker-dashboard-home-page' },
      {
        action: () => {
          if (this.user == null) {
            this.#signIn();
          }
        },
        path: '/repos/(.*)',
        component: 'stryker-dashboard-repositories-page'
      },
      { path: '/reports/(.*)', component: 'stryker-dashboard-report-page' },
      { path: '/auth/github/callback', component: 'stryker-dashboard-auth-page' },
      { path: '(.*)', redirect: '/' },
    ]);
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
    return html`
      <sme-loader slot="right-side" ?doneWithLoading=${this.done}>
        ${when(
          this.user !== null,
          () => html`
            <sme-profile-button
              @sign-out="${this.#signOut}"
              avatarUrl="${this.user!.avatarUrl}"
              name="${this.user!.name}">
            </sme-profile-button>`,
          () => html`
            <sme-button
              @click="${this.#signIn}"
              type="subtle">
              Sign in with GitHub
            </sme-button>`)}
      </sme-loader>`;
  }

  #signIn() {
    const location = locationService.getLocation();
    location.href = `${location.origin}/api/auth/github`;
  }

  #signOut() {
    this.#authService.signOut();
    locationService.getLocation().reload();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard
  }
}
