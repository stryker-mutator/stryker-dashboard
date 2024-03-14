import { defineElement } from '../../../define-element';
import { Link } from '../../../lib/atoms/link';

declare global {
  interface HTMLElementTagNameMap {
    'sme-link': Link;
  }
}

defineElement('sme-link', Link);
