import { StatusBoxElement } from '../components/status-box-component';

declare global {
  interface HTMLElementTagNameMap {
    'status-box-element': StatusBoxElement;
  }
}

customElements.define('status-box-element', StatusBoxElement);
