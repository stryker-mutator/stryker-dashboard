import { SpatiousLayout as SpatiousLayout } from '../../../lib/atoms/spatious-layout';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-spatious-layout': SpatiousLayout;
  }
}

defineElement('sme-spatious-layout', SpatiousLayout);
