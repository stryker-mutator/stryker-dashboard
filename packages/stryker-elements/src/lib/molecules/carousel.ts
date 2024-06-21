import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { html } from 'lit';
import { type CarouselItemProperties } from '../atoms/carousel-item';

export class Carousel extends BaseElement {
  @property()
  carouselItems: CarouselItemProperties[] = [];

  @property()
  nrOfSlidesToShow: number = 4;

  next() {
    const firstItem = this.carouselItems.shift();
    if (firstItem) {
      this.carouselItems.push(firstItem);
    }
    this.requestUpdate();
  }

  previous() {
    const lastItem = this.carouselItems.pop();
    if (lastItem) {
      this.carouselItems.unshift(lastItem);
    }

    this.requestUpdate();
  }

  render() {
    return html`
      <div class="flex justify-between">
        <sme-fab class="place-self-center" icon="chevron-left" @click="${this.previous}"></sme-fab>

        ${this.carouselItems
          .slice(0, this.nrOfSlidesToShow)
          .map(
            (item) =>
              html`<sme-carousel-item
                name="${item.name}"
                logo="${item.logo}"
                url="${item.url}"
              ></sme-carousel-item>`,
          )}

        <sme-fab class="place-self-center" icon="chevron-right" @click="${this.next}"></sme-fab>
      </div>
    `;
  }
}
