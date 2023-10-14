import { StatusBoxComponent } from '../components/status-box-component';

declare global {
  interface HTMLElementTagNameMap {
    'status-box-element': StatusBoxComponent;
  }
}

customElements.define('status-box-component', StatusBoxComponent);
