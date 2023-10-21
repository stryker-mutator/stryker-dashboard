import { LabeledContainerComponent } from '../components/labeled-container-component';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'labeled-container-component': LabeledContainerComponent;
  }
}

defineElement('labeled-container-component', LabeledContainerComponent);
