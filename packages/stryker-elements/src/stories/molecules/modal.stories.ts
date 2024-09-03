import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/buttons/button';
import '../../lib/molecules/modal';

export default {
  title: 'Molecules/Modal',
} as Meta;

export const Default: StoryObj = {
  render: () => html`
    <sme-button @click="${() => document.dispatchEvent(new Event('modal-open'))}">Open modal</sme-button>
    <sme-modal></sme-modal>
  `,
};
