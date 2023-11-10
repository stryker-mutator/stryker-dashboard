import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from 'lit/decorators.js';

export class SignInButton extends BaseElement {
  @property({ type: String })
  url = '/api/auth/github';

  #handleClick = () => {
    window.location.href = this.url;
  };

  render() {
    return html`<button
      @click="${this.#handleClick}"
      class="box-border h-10 rounded-lg border-2 border-solid border-white bg-neutral-800 p-2 pl-2 pr-2"
    >
      <p class="text-l font-bold text-white">Sign in with Github</p>
    </button>`;
  }
}
