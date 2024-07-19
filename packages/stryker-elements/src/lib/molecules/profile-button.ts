import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { BaseElement } from '../base-element.js';

@customElement('sme-profile-button')
export class ProfileButton extends BaseElement {
  @property()
  direction: 'left' | 'right' = 'right';

  @property()
  name = '';

  @property()
  avatarUrl = '';

  @state()
  menuOpened = false;

  render() {
    const directionClasses = classMap({
      'text-right hover:border-l-8 pr-5': this.direction === 'right',
      'text-left hover:border-r-8 pl-5': this.direction !== 'right',
    });

    return html`<button
        @mouseenter="${this.#openMenu}"
        class="profile mr-4 h-10 w-10 overflow-hidden rounded-full border border-2 border-solid border-neutral-600"
      >
        <img class="h-full w-full" src="${this.avatarUrl}" />
      </button>
      <div
        @mouseleave="${this.#closeMenu}"
        class="${classMap({
          'opacity-100': this.menuOpened,
          '-translate-x-40': this.direction === 'right',
        })} align-center absolute z-[999] flex w-48 translate-y-4 flex-col overflow-hidden rounded-md border-2 border-neutral-600 bg-neutral-800 opacity-0 transition"
      >
        <sme-link
          href="/repos/${this.name}"
          class="${directionClasses} d-flex h-10 border-b-2 border-neutral-600 text-white transition-all"
          align="right"
          unStyled
        >
          My repositories
        </sme-link>
        <sme-button
          align="right"
          class="${directionClasses} border-b2 h-10 border-neutral-600 text-white transition-all"
          type="plain"
          @click="${this.#dispatchSignOut}"
        >
          Sign out
        </sme-button>
      </div>`;
  }

  #openMenu() {
    this.menuOpened = true;
  }

  #closeMenu() {
    this.menuOpened = false;
  }

  #dispatchSignOut() {
    this.dispatchEvent(new Event('sign-out', { bubbles: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-profile-button': ProfileButton;
  }
}
