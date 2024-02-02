import { defineElement } from '../../../../define-element';
import { PlainButton } from '../../../../lib/atoms/buttons/plain-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-plain-button': PlainButton;
  }
}

defineElement('sme-plain-button', PlainButton);
