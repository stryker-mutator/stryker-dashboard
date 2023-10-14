import { LitElement, unsafeCSS } from 'lit';

import components from './tailwind-styles/components.css?inline';
import utilities from './tailwind-styles/utilities.css?inline';
import screens from './tailwind-styles/screens.css?inline';
import globals from './tailwind-styles/globals.css?inline';

import './tailwind-styles/preflight.css';
import preflight from './tailwind-styles/preflight.css?inline';

export class BaseElement extends LitElement {
  public static styles = [
    unsafeCSS(preflight),
    unsafeCSS(components),
    unsafeCSS(utilities),
    unsafeCSS(screens),
    unsafeCSS(globals),
  ].filter((styles) => styles.cssText !== '');
}
