import { ProgressBar } from '../../components/common/progress-bar';

declare global {
  interface HTMLElementTagNameMap {
    'progress-bar': ProgressBar;
  }
}

if (!!customElements.get('progress-bar')) {
  customElements.define('progress-bar', ProgressBar);
}
