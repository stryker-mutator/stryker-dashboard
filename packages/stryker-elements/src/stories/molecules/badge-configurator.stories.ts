import '../../lib/atoms/buttons/button';
import '../../lib/molecules/badge-configurator';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Molecules/Badge Configurator',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-badge-configurator></sme-badge-configurator>`,
};
