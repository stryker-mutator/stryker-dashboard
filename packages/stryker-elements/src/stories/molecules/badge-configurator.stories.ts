import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../exports/lib/atoms/buttons/button';
import '../../exports/lib/molecules/badge-configurator';

export default {
  title: 'Molecules/Badge Configurator',
} as Meta;

export const Default: StoryObj = {
  render: () => html` <sme-badge-configurator /> `,
};
