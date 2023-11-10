import { Layout } from '../components/layout';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'layout-component': Layout;
  }
}

defineElement('layout-component', Layout);
