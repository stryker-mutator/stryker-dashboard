import { html } from 'lit';
import { BaseElement } from './base';

export class TestElement extends BaseElement {
  render() {
    return html` <div>Test</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-element': TestElement;
  }
}

customElements.define('test-element', TestElement);
