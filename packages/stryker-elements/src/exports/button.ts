import { Button } from '../components/button';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-button': Button;
  }
}

defineElement('sme-button', Button);
