import { TopBar } from '../components/top-bar';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'top-bar': TopBar;
  }
}

defineElement('top-bar', TopBar);
