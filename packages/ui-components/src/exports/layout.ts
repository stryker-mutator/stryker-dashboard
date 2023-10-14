import { Layout } from '../components/layout';

declare global {
  interface HTMLElementTagNameMap {
    'layout-component': Layout;
  }
}

customElements.define('layout-component', Layout);
