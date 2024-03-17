import { defineElement } from '../../../../define-element';
import { SecondaryButton } from '../../../../lib/atoms/buttons/secondary-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-secondary-button': SecondaryButton;
  }
}

defineElement('sme-secondary-button', SecondaryButton);
