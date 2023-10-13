import { ProfileButton } from '../components/profile-button.ts';

declare global {
  interface HTMLElementTagNameMap {
    'profile-button': ProfileButton;
  }
}

customElements.define('profile-button', ProfileButton);
