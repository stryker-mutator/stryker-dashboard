import { defineElement } from '../../../define-element';
import { ImageButton } from '../../../lib/atoms/image-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-image-button': ImageButton;
  }
}

defineElement('sme-image-button', ImageButton);
