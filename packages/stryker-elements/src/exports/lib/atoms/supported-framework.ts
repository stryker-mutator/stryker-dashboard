import { defineElement } from "../../../define-element";
import { SupportedFramework } from "../../../lib/atoms/supported-framework";

declare global {
  interface HTMLElementTagNameMap {
    'sme-supported-framework': any;
  }
}

defineElement('sme-supported-framework', SupportedFramework);
