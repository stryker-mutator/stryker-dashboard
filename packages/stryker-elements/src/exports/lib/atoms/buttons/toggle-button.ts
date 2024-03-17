import { defineElement } from '../../../../define-element';
import { ToggleButton } from '../../../../lib/atoms/buttons/toggle-button';

declare global {
  interface HTMLElementTagNameMap {
    'sme-toggle-button': ToggleButton;
  }
}

defineElement('sme-toggle-button', ToggleButton);
