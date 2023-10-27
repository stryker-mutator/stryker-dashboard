import { LitElement, unsafeCSS } from 'lit';

import './tailwind-styles/global.css';
import styles from './tailwind-styles/component.css?inline';

export class BaseElement extends LitElement {
  public static styles = [unsafeCSS(styles)];
}
