import { Repository } from '../../../lib/molecules/repository';
import { defineElement } from '../../../define-element';

declare global {
  interface HTMLElementTagNameMap {
    'sme-repository': Repository;
  }
}

defineElement('sme-repository', Repository);
