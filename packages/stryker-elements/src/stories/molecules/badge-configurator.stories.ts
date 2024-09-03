import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/buttons/button';
import '../../lib/molecules/badge-configurator';

export default {
  title: 'Molecules/Badge Configurator',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-badge-configurator></sme-badge-configurator>`,
};
