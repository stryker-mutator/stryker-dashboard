import { Hero as Hero } from '../../../lib/organisms/hero';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-hero': Hero;
  }
}

defineElement('sme-hero', Hero);
