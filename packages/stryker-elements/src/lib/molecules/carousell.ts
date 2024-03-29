import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { html } from 'lit';
import { type CarousellItemProperties } from '../atoms/carousell-item';

export class Carousell extends BaseElement {
  @property()
  carousellItems: CarousellItemProperties[] = [];

  @property()
  nrOfSlidesToShow: number = 4;

  next() {
    const firstItem = this.carousellItems.shift();
    if (firstItem) {
      this.carousellItems.push(firstItem);
    }
    this.requestUpdate();
  }

  previous() {
    const lastItem = this.carousellItems.pop();
    if (lastItem) {
      this.carousellItems.unshift(lastItem);
    }

    this.requestUpdate();
  }

  render() {
    return html`
      <div class="flex justify-between">
        <sme-fab
          class="place-self-center"
          icon="chevron-left"
          @click="${this.previous}"
        ></sme-fab>

        ${this.carousellItems
          .slice(0, this.nrOfSlidesToShow)
          .map(
            (item) =>
              html`<sme-carousell-item
                name="${item.name}"
                logo="${item.logo}"
                url="${item.url}"
              ></sme-carousell-item>`,
          )}

        <sme-fab
          class="place-self-center"
          icon="chevron-right"
          @click="${this.next}"
        ></sme-fab>
      </div>
    `;
  }
}
