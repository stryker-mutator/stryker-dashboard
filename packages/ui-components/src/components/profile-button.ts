import { html } from 'lit';
import { BaseElement } from '../base.ts';
import { property } from 'lit/decorators.js';

type User = {
  name: string;
  avatarUrl: string;
};

export class ProfileButton extends BaseElement {
  @property()
  user: User = { name: '', avatarUrl: '' };

  render() {
    return html`<button
      class="rounded-full overflow-hidden w-10 h-10 border-solid border-neutral-600 border border-2"
    >
      <img class="w-full h-full" src="${this.user.avatarUrl}" />
    </button>`;
  }
}
