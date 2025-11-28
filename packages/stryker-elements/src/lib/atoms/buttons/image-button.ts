import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../../base-element.ts';

@customElement('sme-image-button')
export class ImageButton extends BaseElement {
  @property({ attribute: true })
  direction: 'left' | 'right' = 'left';

  @property({ attribute: true })
  src = '';

  render() {
    return html`
      <div>
        ${this.direction === 'left' && html`<img src=${this.src} />`}
        <sme-button></sme-button>
        ${this.direction === 'right' && html`<img src=${this.src} />`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-image-button': ImageButton;
  }
}
