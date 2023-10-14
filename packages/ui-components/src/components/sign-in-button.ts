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
      class="h-10 pl-2 pr-2 border-2 box-border bg-neutral-800 border-solid border-white"
    >
      <h3 class="font-bold text-white text-l">Sign in with Github</h3>
    </button>`;
  }
}
