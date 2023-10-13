import { LitElement } from 'lit';

export class BaseElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}
