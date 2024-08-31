import { html } from 'lit';
import { BaseElement } from '../base-element';
import { customElement, property } from 'lit/decorators.js';

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
    return html`<a href="${this.#buildReportUrl()}"><img src="${this.#buildBadgeUrl()}" /></a>`;
  }

  #buildReportUrl() {
    return `${window.location.origin}/reports/${this.slug}`;
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
