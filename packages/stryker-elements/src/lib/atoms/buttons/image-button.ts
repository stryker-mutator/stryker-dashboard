import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { BaseElement } from '../../base-element';

import '../../../exports/lib/atoms/buttons/button';

export class ImageButton extends BaseElement {
  @property({ attribute: true })
  direction: 'left' | 'right' = 'left';

  @property({ attribute: true })
  src = '';

  render() {
    return html`
      <div>
        ${this.direction === 'left' && html`<img src="${this.src}" />`}
        <sme-button></sme-button>
        ${this.direction === 'right' && html`<img src="${this.src}" />`}
      </div>
    `;
  }
}
