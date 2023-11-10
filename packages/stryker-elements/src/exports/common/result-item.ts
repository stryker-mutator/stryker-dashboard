import { ResultItem } from '../../components/common/result-item';
import { defineElement } from '../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'result-item': ResultItem;
  }
}

defineElement('result-item', ResultItem);
