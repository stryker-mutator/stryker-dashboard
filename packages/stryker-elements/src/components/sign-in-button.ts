import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class SignInButton extends BaseElement {
  @property({ type: String })
  url = '/api/auth/github';

  _handleClick = () => {
    window.location.href = this.url;
  };

  render() {
    return html`<button
      @click="${this._handleClick}"
      class="box-border h-10 border-2 border-solid border-white bg-neutral-800 pl-2 pr-2"
    >
      <h3 class="text-l font-bold text-white">Sign in with Github</h3>
    </button>`;
  }
}
