import { defineElement } from '../../../define-element';
import { Hr } from '../../../lib/atoms/hr';

declare global {
  interface HTMLElementTagNameMap {
    'sme-hr': Hr;
  }
}

defineElement('sme-hr', Hr);
