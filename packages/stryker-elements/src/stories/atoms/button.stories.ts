import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/atoms/button';
import { html } from 'lit';

export default {
  title: 'Atoms/Button',
  render: () => html` <sme-button>Click here!</sme-button> `,
} as Meta;

export const Default: StoryObj = {};
