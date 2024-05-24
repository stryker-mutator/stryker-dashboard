import { defineElement } from '../../../define-element';
import { Badge } from '../../../lib/atoms/badge';

declare global {
  interface HTMLElementTagNameMap {
    'sme-badge': Badge;
  }
}

defineElement('sme-badge', Badge);
