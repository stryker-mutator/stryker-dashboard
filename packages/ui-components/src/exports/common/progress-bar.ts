import { ProgressBar } from '../../components/common/progress-bar';

declare global {
  interface HTMLElementTagNameMap {
    'progress-bar': ProgressBar;
  }
}

customElements.define('progress-bar', ProgressBar);
