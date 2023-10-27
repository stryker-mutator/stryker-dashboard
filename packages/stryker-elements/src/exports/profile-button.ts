import { ProfileButton } from '../components/profile-button';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'profile-button': ProfileButton;
  }
}

defineElement('profile-button', ProfileButton);
