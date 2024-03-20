import { defineElement } from '../../../define-element';
import { Carousell } from '../../../lib/molecules/carousell';

declare global {
  interface HTMLElementTagNameMap {
    'sme-carousell': Carousell;
  }
}

defineElement('sme-carousell', Carousell);
