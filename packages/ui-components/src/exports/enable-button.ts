import { defineElement } from '../define-element';
import { EnableButton } from './../components/enable-button';

declare global {
  interface HTMLElementTagNameMap {
    'enable-button': EnableButton;
  }
}

defineElement('enable-button', EnableButton);
