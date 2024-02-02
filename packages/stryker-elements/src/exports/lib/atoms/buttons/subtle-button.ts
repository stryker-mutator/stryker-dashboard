import { defineElement } from '../../../../define-element';
import { SubtleButton } from '../../../../lib/atoms/buttons/subtle-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-subtle-button': SubtleButton;
  }
}

defineElement('sme-subtle-button', SubtleButton);
