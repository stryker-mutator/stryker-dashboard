import { html } from 'lit';
import { BaseElement } from '../base';

export class Layout extends BaseElement {
  render() {
    return html`
      <div class="m-auto max-w-screen-xl p-8">
        <slot></slot>
      </div>
    `;
  }
}
