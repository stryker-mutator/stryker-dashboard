import { html } from 'lit';
import { BaseElement } from '../base-element';

export class Hr extends BaseElement {
  render() {
    return html`<hr class="my-2 rounded border-t-[3px] border-neutral-700" />`;
  }
}
