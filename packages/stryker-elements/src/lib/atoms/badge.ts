import { buildReportUrl } from '@stryker-mutator/dashboard-common';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseElement } from '../base-element';

export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';

const BASE_BADGE_URL = 'https://img.shields.io/endpoint';

@customElement('sme-badge')
export class Badge extends BaseElement {
  @property()
  badgeStyle: BadgeStyle = 'for-the-badge';

  @property()
  dashboardBadgeUrl = 'https://badge-api.stryker-mutator.io/';

  @property()
  slug = '';

  render() {
    return html`<a href="${buildReportUrl(this.slug)}">
      <img src="${this.#buildBadgeUrl()}" alt="${this.slug} badge" />
    </a>`;
  }

  #buildBadgeUrl() {
    const dashboardBadgeUrl = encodeURIComponent(`${this.dashboardBadgeUrl}${this.slug}`);
    return `${BASE_BADGE_URL}?style=${this.badgeStyle}&url=${dashboardBadgeUrl}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-badge': Badge;
  }
}
