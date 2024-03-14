import { defineElement } from '../../../define-element';
import { StrykerDashboardExplanation } from '../../../main';

declare global {
  interface HTMLElementTagNameMap {
    'sme-stryker-dashboard-explanation': StrykerDashboardExplanation;
  }
}

defineElement('sme-stryker-dashboard-explanation', StrykerDashboardExplanation);
