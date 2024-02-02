import { defineElement } from '../../../define-element';
import { Dropdown } from '../../../lib/atoms/dropdown';

declare global {
  interface HTMLElementTagNameMap {
    'sme-dropdown': Dropdown;
  }
}

defineElement('sme-dropdown', Dropdown);
