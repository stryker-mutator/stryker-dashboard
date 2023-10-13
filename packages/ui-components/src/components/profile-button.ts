import { html } from 'lit';
import { BaseElement } from '../base.ts';
import { property, state } from 'lit/decorators.js';

type User = {
  name: string;
  avatarUrl: string;
};

export class ProfileButton extends BaseElement {
  @property()
  user: User = { name: '', avatarUrl: '' };
  logout = () => {
    window.location.href = '/';
    return;
  };

  @state()
  private clicked = true;

  _handleClick = () => {
    this.clicked = !this.clicked;
  };

  _navigateToRepositories = () => {
    window.location.href = `/repos/${this.user.name}`;
  };

  render() {
    return html`<button
        @click="${this._handleClick}"
        class="rounded-full overflow-hidden w-10 h-10 border-solid border border-neutral-600 border border-2  mr-4"
      >
        <img class="w-full h-full" src="${this.user.avatarUrl}" />
      </button>
      <div
        class="${this.clicked
          ? ''
          : 'hidden'} absolute -translate-x-40 translate-y-4 overflow-hidden border border-2 border-neutral-600 rounded-md w-48 bg-neutral-800 flex align-center flex-col text-right"
      >
        <button
          @click="${this._navigateToRepositories}"
          class="transition-all  hover:border-l-8 pr-5 text-right h-10 border-b-2 border-neutral-600"
        >
          My repositories
        </button>
        <button
          @click="${this.logout}"
          class="transition-all hover:border-l-8 h-10 border-neutral-600 text-right pr-5"
        >
          Sign out
        </button>
      </div>`;
  }
}
