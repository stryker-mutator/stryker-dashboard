import { TestElement } from '../components/test';

declare global {
  interface HTMLElementTagNameMap {
    'test-element': TestElement;
  }
}

customElements.define('test-element', TestElement);
