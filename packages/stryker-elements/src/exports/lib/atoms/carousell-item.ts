import { defineElement } from '../../../define-element';
import { CarousellItem } from '../../../lib/atoms/carousell-item';

declare global {
  interface HTMLElementTagNameMap {
    'sme-carousell-item': CarousellItem;
  }
}

defineElement('sme-carousell-item', CarousellItem);
