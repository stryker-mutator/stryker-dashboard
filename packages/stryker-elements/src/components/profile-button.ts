import { html } from 'lit';
import { BaseElement } from '../base';
import { property, state } from 'lit/decorators.js';

export class ProfileButton extends BaseElement {
  @property()
  direction: 'left' | 'right' = 'right';

  @property()
  name = '';

  @property()
  avatarUrl = '';

  @state()
  clicked = false;

  _handleClick = () => {
    this.clicked = !this.clicked;
  };

  _navigateToRepositories = () => {
    window.location.href = `/repos/${this.name}`;
  };

  #dispatchSignOut() {
    this.dispatchEvent(new Event('sign-out', { bubbles: true }));
  }

  render() {
    return html`<button
        @click="${this._handleClick}"
        class="mr-4 h-10 w-10 overflow-hidden rounded-full border border border-2 border-solid  border-neutral-600"
      >
        <img class="h-full w-full" src="${this.avatarUrl}" />
      </button>
      <div
        class="${this.clicked ? '' : 'hidden'} ${this.direction == 'right'
          ? '-translate-x-40'
          : ''} align-center absolute z-[999] flex w-48 translate-y-4 flex-col overflow-hidden rounded-md border border-2 border-neutral-600 bg-neutral-800"
      >
        <button
          @click="${this._navigateToRepositories}"
          class="${this.direction == 'right'
            ? 'text-right hover:border-l-8 pr-5'
            : 'text-left hover:border-r-8 pl-5'} h-10 border-b-2 border-neutral-600 text-white transition-all"
        >
          My repositories
        </button>
        <button
          @click="${this.#dispatchSignOut}"
          class="${this.direction == 'right'
            ? 'text-right hover:border-l-8 pr-5'
            : 'text-left hover:border-r-8 pl-5'} h-10 border-neutral-600 text-white transition-all"
        >
          Sign out
        </button>
      </div>`;
  }
}
