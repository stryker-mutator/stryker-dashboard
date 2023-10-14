import { EnableButton } from './../components/enable-button';

declare global {
  interface HTMLElementTagNameMap {
    'enable-button': EnableButton;
  }
}

customElements.define('enable-button', EnableButton);
