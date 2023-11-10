import { html } from 'lit';
import { BaseElement } from '../base';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class ProfileButton extends BaseElement {
  @property()
  direction: 'left' | 'right' = 'right';

  @property()
  name = '';

  @property()
  avatarUrl = '';

  @state()
  clicked = false;

  #handleClick = () => {
    this.clicked = !this.clicked;
  };

  #navigateToRepositories = () => {
    window.location.href = `/repos/${this.name}`;
  };

  #dispatchSignOut() {
    this.dispatchEvent(new Event('sign-out', { bubbles: true }));
  }

  render() {
    const directionClasses = classMap({
      'text-right hover:border-l-8 pr-5': this.direction === 'right',
      'text-left hover:border-r-8 pl-5': this.direction !== 'right',
    });

    return html`<button
        @click="${this.#handleClick}"
        class="mr-4 h-10 w-10 overflow-hidden rounded-full border border border-2 border-solid  border-neutral-600"
      >
        <img class="h-full w-full" src="${this.avatarUrl}" />
      </button>
      <div
        class="${classMap({
          hidden: !this.clicked,
          '-translate-x-40': this.direction === 'right',
        })} align-center absolute z-[999] flex w-48 translate-y-4 flex-col overflow-hidden rounded-md border border-2 border-neutral-600 bg-neutral-800"
      >
        <button
          @click="${this.#navigateToRepositories}"
          class="${directionClasses} h-10 border-b-2 border-neutral-600 text-white transition-all"
        >
          My repositories
        </button>
        <button
          @click="${this.#dispatchSignOut}"
          class="${directionClasses} border-b2 h-10 border-neutral-600 text-white transition-all"
        >
          Sign out
        </button>
      </div>`;
  }
}
