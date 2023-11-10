import { SignInButton } from '../components/sign-in-button';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sign-in-button': SignInButton;
  }
}

defineElement('sign-in-button', SignInButton);
