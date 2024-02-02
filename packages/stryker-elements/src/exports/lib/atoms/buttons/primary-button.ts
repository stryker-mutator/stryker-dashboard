import { defineElement } from '../../../../define-element';
import { PrimaryButton } from '../../../../lib/atoms/buttons/primary-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-primary-button': PrimaryButton;
  }
}

defineElement('sme-primary-button', PrimaryButton);
