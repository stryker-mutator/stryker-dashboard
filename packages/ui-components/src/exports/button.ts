import { Button } from '../components/button';

declare global {
  interface HTMLElementTagNameMap {
    'hero-button': Button;
  }
}

if (!customElements.get('sme-button')) {
  customElements.define('sme-button', Button);
}
