import { LitElement, PropertyValues } from 'lit'
import { customElement } from 'lit/decorators.js'
import {TheAuthService } from '../services/auth.service';

@customElement('stryker-dashboard-auth-page')
export class HomePage extends LitElement {
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    const url = new URL(document.location.toString()).searchParams;
    const code = url.get('code')!;

    TheAuthService.authenticate("github", code).then(() => {
      window.location.href = '/';
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-auth-page': HomePage
  }
}
