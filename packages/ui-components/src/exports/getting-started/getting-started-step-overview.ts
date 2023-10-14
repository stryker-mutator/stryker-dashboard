import { GettingStartedStepOverview } from '../../components/getting-started/getting-started-step-overview';

declare global {
  interface HTMLElementTagNameMap {
    'getting-started-step-overview': GettingStartedStepOverview;
  }
}

customElements.define(
  'getting-started-step-overview',
  GettingStartedStepOverview
);
