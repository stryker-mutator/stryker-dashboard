import './pages/auth.page.ts';
import './pages/home.page.ts';
import './pages/repositories.page.ts';
/* Import preflight styles */
import '@stryker-mutator/stryker-elements';

import { Routes } from '@lit-labs/router';
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
  #routes: Routes | null;

  @state()
  done = false;

  @state()
  user: Login | null;

  constructor() {
    super();

    this.#authService = authService;
    this.#routes = null;

    this.user = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    void this.#authService.getUser().then((user) => {
      this.user = user;
      this.#configureRouting();
      this.done = true;
    });
  }

  override createRenderRoot() {
    return this;
  }

  #configureRouting() {
    this.#routes = new Routes(this, [
      {
        path: '/',
        render: () => html`<stryker-dashboard-home-page></stryker-dashboard-home-page>`,
      },
      {
        path: '/repos/:orgOrUser?',
        render: ({ orgOrUser }) =>
          html`<stryker-dashboard-repositories-page .orgOrUser=${orgOrUser}></stryker-dashboard-repositories-page>`,
        enter: () => {
          if (!this.user) {
            this.#signIn();
          }
          return true;
        },
      },
      {
        path: '/reports/(.*)',
        render: () => html`<stryker-dashboard-report-page></stryker-dashboard-report-page>`,
        // Lazy load the report page
        enter: async () => {
          await import('./pages/report.page.ts');
          return true;
        },
      },
      {
        path: '/auth/github/callback',
        render: () => html`<stryker-dashboard-auth-page></stryker-dashboard-auth-page>`,
      },
      {
        path: '/*',
        enter: async () => {
          await this.#routes?.goto('/');
          return false;
        },
      },
    ]);
  }

  override render() {
    return html`
      <sme-top-bar logoUrl="/images/stryker.svg">${this.#renderProfileButtonOrSignInButton()}</sme-top-bar>
      <main>${this.#routes?.outlet()}</main>
    `;
  }

  #renderProfileButtonOrSignInButton() {
    return html`<sme-loader slot="right-side" .loading=${!this.done}>
      ${when(
        this.user !== null,
        () =>
          html`<sme-profile-button
            @sign-out="${this.#signOut}"
            avatarUrl="${this.user!.avatarUrl}"
            name="${this.user!.name}"
          >
          </sme-profile-button>`,
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
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard': StrykerDashboard;
  }
}
