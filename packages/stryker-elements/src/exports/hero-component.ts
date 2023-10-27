import { HeroComponent } from '../components/hero-component';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'hero-component': HeroComponent;
  }
}

defineElement('hero-component', HeroComponent);
