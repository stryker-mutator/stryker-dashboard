import '../tailwind-styles/global.css';

import { LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from '../tailwind-styles/component.css?inline';

export class BaseElement extends LitElement {
  public static styles = [unsafeCSS(styles)];

  @property({ type: Boolean })
  unStyled = false;
}
