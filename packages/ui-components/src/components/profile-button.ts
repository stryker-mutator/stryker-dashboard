import { html } from 'lit';
import { BaseElement } from '../base';
import { property, state } from 'lit/decorators.js';

type User = {
  name: string;
  avatarUrl: string;
};

export class ProfileButton extends BaseElement {
  @property()
  direction: 'left' | 'right' = 'right';
  @property()
  user: User = { name: '', avatarUrl: '' };

  @state()
  private clicked = true;

  _handleClick = () => {
    this.clicked = !this.clicked;
  };

  _navigateToRepositories = () => {
    window.location.href = `/repos/${this.user.name}`;
  };

  #dispatchSignOut() {
    this.dispatchEvent(new Event('sign-out'));
  }

  render() {
    return html`<button
        @click="${this._handleClick}"
        class="rounded-full overflow-hidden w-10 h-10 border-solid border border-neutral-600 border border-2  mr-4"
      >
        <img class="w-full h-full" src="${this.user.avatarUrl}" />
      </button>
      <div
        class="${this.clicked ? '' : 'hidden'} absolute ${this.direction ==
        'right'
          ? '-translate-x-40'
          : ''} z-[999] translate-y-4 overflow-hidden border border-2 border-neutral-600 rounded-md w-48 bg-neutral-800 flex align-center flex-col"
      >
        <button
          @click="${this._navigateToRepositories}"
          class="${this.direction == 'right'
            ? 'text-right hover:border-l-8 pr-5'
            : 'text-left hover:border-r-8 pl-5'} text-white transition-all h-10 border-b-2 border-neutral-600"
        >
          My repositories
        </button>
        <button
          @click="${this.#dispatchSignOut}"
          class="${this.direction == 'right'
            ? 'text-right hover:border-l-8 pr-5'
            : 'text-left hover:border-r-8 pl-5'} text-white transition-all h-10 border-neutral-600"
        >
          Sign out
        </button>
      </div>`;
  }
}
