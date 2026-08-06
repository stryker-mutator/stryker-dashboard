import type { Router } from '@lit-labs/router';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { authService } from '../services/auth.service.ts';
import { locationService } from '../services/location.service.ts';

@customElement('stryker-dashboard-auth-page')
export class AuthPage extends LitElement {
  @state()
  failed = false;

  @property({ attribute: false })
  router!: Router;

  override connectedCallback(): void {
    super.connectedCallback();

    const location = locationService.getLocation();
    const authorizationResponse = new URL(location.toString()).searchParams;

    void authService
      .authenticate('github', authorizationResponse)
      .then(async () => {
        const user = await authService.getUser();
        await this.router.goto(`/repos/${user!.name}`);
      })
      .catch(() => {
        this.failed = true;
      });
  }

  override render() {
    return html`
      <sme-spatious-layout>
        ${
          this.failed
            ? html`<sme-notify type="error">
                Signing in failed. <a href="/api/auth/github">Please try again</a>.
              </sme-notify>`
            : html`<sme-notify type="info">Authenticating, hold on for a moment...</sme-notify>`
        }
      </sme-spatious-layout>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-auth-page': AuthPage;
  }
}
