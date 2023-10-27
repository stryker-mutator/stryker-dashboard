import { GettingStartedStep } from '../../components/getting-started/getting-started-step';
import { GettingStartedStepOverview } from '../../components/getting-started/getting-started-step-overview';
import { defineElement } from '../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'getting-started-step-overview': GettingStartedStepOverview;
  }
}

defineElement('getting-started-step', GettingStartedStep);
defineElement('getting-started-step-overview', GettingStartedStepOverview);
