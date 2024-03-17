import { defineElement } from '../../../define-element';
import { Notify } from '../../../lib/atoms/notify';

declare global {
  interface HTMLElementTagNameMap {
    'sme-notify': Notify;
  }
}

defineElement('sme-notify', Notify);
