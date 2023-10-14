import { GettingStartedStep } from '../../components/getting-started/getting-started-step';
import { GettingStartedStepOverview } from '../../components/getting-started/getting-started-step-overview';

declare global {
  interface HTMLElementTagNameMap {
    'getting-started-step-overview': GettingStartedStepOverview;
  }
}

if (!customElements.get('getting-started-step')) {
  customElements.define('getting-started-step', GettingStartedStep);
}

customElements.define(
  'getting-started-step-overview',
  GettingStartedStepOverview
);
