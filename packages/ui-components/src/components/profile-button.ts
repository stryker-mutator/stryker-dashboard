import { html } from 'lit';
import { BaseElement } from '../base.ts';

export class ProfileButton extends BaseElement {
  _handleClick = () => {
    return;
  };

  render() {
    return html`<button @click="${this._handleClick}"></button>`;
  }
}
