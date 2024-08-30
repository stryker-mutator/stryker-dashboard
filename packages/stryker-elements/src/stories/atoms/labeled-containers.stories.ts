import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/labeled-container';

export default {
  title: 'Atoms/Labeled Container',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => html` <sme-labeled-container>Go Here!</sme-labeled-container> `,
};
