import { defineElement } from "../../../define-element";
import { SupportedFrameworkList } from "../../../lib/molecules/supported-framework-list";

declare global {
  interface HTMLElementTagNameMap {
    'sme-supported-framework-list': any;
  }
}

defineElement('sme-supported-framework-list', SupportedFrameworkList);
