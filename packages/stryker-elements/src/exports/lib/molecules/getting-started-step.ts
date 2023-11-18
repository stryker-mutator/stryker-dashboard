import { GettingStartedStep } from '../../../lib/molecules/getting-started-step';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-getting-started-step': GettingStartedStep;
  }
}

defineElement('sme-getting-started-step', GettingStartedStep);
