import { LabeledContainer as LabeledContainer } from '../../../lib/atoms/labeled-container';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-labeled-container': LabeledContainer;
  }
}

defineElement('sme-labeled-container', LabeledContainer);
