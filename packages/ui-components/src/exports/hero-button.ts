import { HeroButton } from '../components/hero-button';

declare global {
  interface HTMLElementTagNameMap {
    'hero-button': HeroButton;
  }
}

customElements.define('hero-button', HeroButton);
