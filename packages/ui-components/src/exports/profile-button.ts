import { ProfileButton } from '../components/profile-button';

declare global {
  interface HTMLElementTagNameMap {
    'profile-button': ProfileButton;
  }
}

customElements.define('profile-button', ProfileButton);
