import { TopBar } from '../../../lib/organisms/top-bar';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-top-bar': TopBar;
  }
}

defineElement('sme-top-bar', TopBar);
