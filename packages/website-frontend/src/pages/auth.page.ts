import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { authService } from '../services/auth.service';
import { locationService } from '../services/location.service';

@customElement('stryker-dashboard-auth-page')
export class AuthPage extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();

    const location = locationService.getLocation();
    const url = new URL(location.toString()).searchParams;
    const code = url.get('code')!;

    void authService.authenticate('github', code).then(async () => {
      const user = await authService.getUser();
      location.href = `/repos/${user!.name}`;
    });
  }

  override render() {
    return html`
      <sme-spatious-layout>
        <sme-notify type="info">Authenticating, hold on for a moment...</sme-notify>
      </sme-spatious-layout>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-auth-page': AuthPage;
  }
}
