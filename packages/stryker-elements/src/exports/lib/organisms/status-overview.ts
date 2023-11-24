import { StatusOverview } from '../../../lib/organisms/status-overview';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'status-status-overview': StatusOverview;
  }
}

defineElement('sme-status-overview', StatusOverview);
