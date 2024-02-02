import { defineElement } from '../../../../define-element';
import { Button } from '../../../../lib/atoms/buttons/button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-button': Button;
  }
}

defineElement('sme-button', Button);
