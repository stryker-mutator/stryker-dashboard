import { defineElement } from '../../../define-element';
import { FAB } from '../../../lib/atoms/fab';

declare global {
  interface HTMLElementTagNameMap {
    'sme-fab': FAB;
  }
}

defineElement('sme-fab', FAB);
