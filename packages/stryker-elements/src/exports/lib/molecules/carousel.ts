import { defineElement } from '../../../define-element';
import { Carousel } from '../../../lib/molecules/carousel';

declare global {
  interface HTMLElementTagNameMap {
    'sme-carousel': Carousel;
  }
}

defineElement('sme-carousel', Carousel);
