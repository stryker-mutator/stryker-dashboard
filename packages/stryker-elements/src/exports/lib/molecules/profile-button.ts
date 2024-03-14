import { ProfileButton } from '../../../lib/molecules/profile-button';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-profile-button': ProfileButton;
  }
}

defineElement('sme-profile-button', ProfileButton);
