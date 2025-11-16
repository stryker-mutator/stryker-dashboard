import './pages/auth.page.ts';
import './pages/home.page.ts';
import './pages/repositories.page.ts';
/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

import { Router } from '@lit-labs/router';
import type { Login } from '@stryker-mutator/dashboard-contract';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import type { AuthService } from './services/auth.service.ts';
import { authService } from './services/auth.service.ts';
import { locationService } from './services/location.service.ts';

@customElement('stryker-dashboard')
export class StrykerDashboard extends LitElement {
  #authService: AuthService;
  #router: Router;

  @state()
  done = false;

  @state()
  user: Login | null;

  constructor() {
    super();

    this.#authService = authService;
    this.user = null;

    this.#router = new Router(
      this,
      [
        {
          path: '/',
          name: 'home',
          render: () => html`<stryker-dashboard-home-page></stryker-dashboard-home-page>`,
        },
        {
          path: '/repos/:orgOrUser?',
          name: 'repositories',
          render: ({ orgOrUser }) =>
            html`<stryker-dashboard-repositories-page .orgOrUser=${orgOrUser}></stryker-dashboard-repositories-page>`,
          enter: async () => {
            if (!(this.user ?? (await this.#getUser()))) {
              this.#signIn();
            }
            return true;
          },
        },
        {
          path: '/reports/(.*)',
          name: 'report',
          render: () => html`<stryker-dashboard-report-page></stryker-dashboard-report-page>`,
          // Lazy load the report page
          enter: async () => {
            await import('./pages/report.page.ts');
            return true;
          },
        },
        {
          path: '/auth/github/callback',
          name: 'auth',
          render: () => html`<stryker-dashboard-auth-page></stryker-dashboard-auth-page>`,
        },
      ],
      {
        fallback: {
          name: 'not-found',
          enter: async () => {
            await this.#router.goto('/');
            return false;
          },
        },
      },
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();

    void this.#getUser();
  }

  override createRenderRoot() {
    return this;
  }

  override render() {
    console.log(this.#router.link());
    return html`
      <sme-top-bar logoUrl="/images/stryker.svg">${this.#renderProfileButtonOrSignInButton()}</sme-top-bar>
      <main>${when(this.done, () => this.#router.outlet())}</main>
    `;
  }

  #renderProfileButtonOrSignInButton() {
    return html`<sme-loader slot="right-side" .loading=${!this.done}>
      ${when(
        this.user,
        (user) =>
          html`<sme-profile-button
            @sign-out="${this.#signOut}"
            avatarUrl="${user.avatarUrl}"
            name="${user.name}"
          ></sme-profile-button>`,
        () => html`<sme-button @click="${this.#signIn}" type="subtle">Sign in with GitHub</sme-button>`,
      )}
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

  async #getUser() {
    const user = await this.#authService.getUser();
    this.user = user;
    this.done = true;
    return user;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard;
  }
}
