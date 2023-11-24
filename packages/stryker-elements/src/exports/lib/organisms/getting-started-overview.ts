import { GettingStartedOverview as GettingStartedOverview } from '../../../lib/organisms/getting-started-overview';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-getting-started-overview': GettingStartedOverview;
  }
}

defineElement('sme-getting-started-overview', GettingStartedOverview);
