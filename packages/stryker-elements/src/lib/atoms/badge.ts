import { html } from 'lit';
import { BaseElement } from '../base-element';
import { property } from 'lit/decorators.js';

const BASE_BADGE_URL = 'https://img.shields.io/endpoint'

export class Badge extends BaseElement {
  @property()
  badgeStyle = 'for-the-badge'

  @property()
  dashboardBadgeUrl = 'https://badge-api.stryker-mutator.io/';

  @property()
  slug = '';

  render() {
    return html`<img src="${this.#buildBadgeUrl()}" />`;
  }

  #buildBadgeUrl() {
    const dashboardBadgeUrl = encodeURIComponent(`${this.dashboardBadgeUrl}${this.slug}`);
    return `${BASE_BADGE_URL}?style=${this.badgeStyle}&url=${dashboardBadgeUrl}`;
  }
}
