import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { authService } from '../services/auth.service';

@customElement('stryker-dashboard-auth-page')
export class HomePage extends LitElement {
  override firstUpdated(): void {
    const url = new URL(document.location.toString()).searchParams;
    const code = url.get('code')!;

    authService.authenticate("github", code)
      .then(() => {
        window.location.href = '/';
      });
  }

  override render() {
    return html`
      <sme-spatious-layout>
        <sme-notify message="Authenticating, hold on for a moment..."></sme-notify>
      </sme-spatious-layout>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-auth-page': HomePage
  }
}
