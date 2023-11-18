import { LitElement, unsafeCSS } from 'lit';

import '../tailwind-styles/global.css';
import styles from '../tailwind-styles/component.css?inline';
import { property } from 'lit/decorators.js';

export class BaseElement extends LitElement {
  public static styles = [unsafeCSS(styles)];

  @property({ type: Boolean })
  unStyled = false;
}
