import { html } from 'lit';
import { BaseElement } from '../base';

export class Layout extends BaseElement {
  render() {
    return html`
      <div class="max-w-screen-xl m-auto p-8">
        <slot></slot>
      </div>
    `;
  }
}
