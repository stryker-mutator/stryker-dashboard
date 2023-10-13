import { html } from 'lit';
import { BaseElement } from '../base';

export class TestElement extends BaseElement {
  render() {
    return html` <div class="bg-red-300">Test</div> `;
  }
}
