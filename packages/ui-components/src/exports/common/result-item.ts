import { ResultItem } from '../../components/common/result-item';

declare global {
  interface HTMLElementTagNameMap {
    'result-item': ResultItem;
  }
}

customElements.define('result-item', ResultItem);
