import { TopBar } from '../components/top-bar.ts';

declare global {
  interface HTMLElementTagNameMap {
    'top-bar': TopBar;
  }
}

customElements.define('top-bar', TopBar);
