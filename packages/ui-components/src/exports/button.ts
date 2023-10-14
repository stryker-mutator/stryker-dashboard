import { Button } from '../components/button';

declare global {
  interface HTMLElementTagNameMap {
    'hero-button': Button;
  }
}

customElements.define('button', Button);
