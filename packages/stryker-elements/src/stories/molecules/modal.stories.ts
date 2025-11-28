import '../../lib/atoms/buttons/button';
import '../../lib/molecules/modal';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Molecules/Modal',
} as Meta;

export const Default: StoryObj = {
  render: () => html`
    <sme-button @click=${() => document.dispatchEvent(new Event('modal-open'))}>Open modal</sme-button>
    <sme-modal></sme-modal>
  `,
};
