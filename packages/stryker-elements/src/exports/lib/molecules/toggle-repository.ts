import { defineElement } from '../../../define-element';
import { ToggleRepository } from '../../../lib/molecules/toggle-repository';

declare global {
  interface HTMLElementTagNameMap {
    'sme-toggle-repository': ToggleRepository;
  }
}

defineElement('sme-toggle-repository', ToggleRepository);
