import { HeroComponent } from '../components/hero-component';

declare global {
  interface HTMLElementTagNameMap {
    'hero-component': HeroComponent;
  }
}

if (!customElements.get('hero-component')) {
  customElements.define('hero-component', HeroComponent);
}
