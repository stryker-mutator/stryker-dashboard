import { BadgeConfigurator } from '../../../lib/molecules/badge-configurator';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-badge-configurator': BadgeConfigurator;
  }
}

defineElement('sme-badge-configurator', BadgeConfigurator);
