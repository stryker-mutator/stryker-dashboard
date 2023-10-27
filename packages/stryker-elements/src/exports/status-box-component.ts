import { StatusBoxComponent } from '../components/status-box-component';
import { defineElement } from '../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'status-box-element': StatusBoxComponent;
  }
}

defineElement('status-box-component', StatusBoxComponent);
