import { property } from 'lit/decorators.js';
import { BaseElement } from '../base-element';
import { css, html } from 'lit';

type carousellItem = {
  name: string;
  logo: string;
  url: string;
};

export class Carousell extends BaseElement {
  @property()
  carousellItems: carousellItem[] = [];

  carouselLength: number = 4;

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
  }

  render() {
    return html`
      <button @click="${this.previous}">👈</button>
      <button @click="${this.next}">👉</button>

      <div class="grid grid-cols-4 place-items-center">
        ${this.carousellItems
          .slice(0, this.carouselLength)
          .map(
            (item) =>
              html`<sme-supported-framework
                name="${item.name}"
                logo="${item.logo}"
                url="${item.url}"
              ></sme-supported-framework>`,
          )}
      </div>
    `;
  }

  static styles = [
    ...BaseElement.styles,
    css`
      sme-supported-framework {
        transition: transform 0.5s ease-in-out;
      }

      sme-supported-framework.moving {
        transform: translateX(100%);
      }
    `,
  ];
}
