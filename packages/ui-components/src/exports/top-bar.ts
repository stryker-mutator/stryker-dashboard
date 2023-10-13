import { TopBar } from '../components/top-bar';

declare global {
  interface HTMLElementTagNameMap {
    'top-bar': TopBar;
  }
}

customElements.define('top-bar', TopBar);
