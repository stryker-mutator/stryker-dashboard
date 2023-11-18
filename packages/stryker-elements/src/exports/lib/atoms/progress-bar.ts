import { ProgressBar } from '../../../lib/atoms/progress-bar';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'progress-bar': ProgressBar;
  }
}

defineElement('progress-bar', ProgressBar);
