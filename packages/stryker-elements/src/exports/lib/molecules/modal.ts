import { defineElement } from '../../../define-element';
import { Modal } from '../../../lib/molecules/modal';

declare global {
  interface HTMLElementTagNameMap {
    'sme-modal': Modal;
  }
}

defineElement('sme-modal', Modal);
