import { LabeledContainerComponent } from '../components/labeled-container-component';

declare global {
  interface HTMLElementTagNameMap {
    'labeled-container-component': LabeledContainerComponent;
  }
}

customElements.define('labeled-container-component', LabeledContainerComponent);
