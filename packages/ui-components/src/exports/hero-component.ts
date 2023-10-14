import { HeroComponent } from '../components/hero-component';

declare global {
  interface HTMLElementTagNameMap {
    'hero-component': HeroComponent;
  }
}

customElements.define('hero-component', HeroComponent);
