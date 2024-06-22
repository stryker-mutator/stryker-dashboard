import { defineElement } from '../../../define-element';
import { CarousellItem } from '../../../lib/atoms/carousel-item';

declare global {
  interface HTMLElementTagNameMap {
    'sme-carousell-item': CarousellItem;
  }
}

defineElement('sme-carousel-item', CarousellItem);
