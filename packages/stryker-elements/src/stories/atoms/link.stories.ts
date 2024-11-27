import '../../lib/atoms/link';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Atoms/Link',
} as Meta;

export const Default: StoryObj = {
  name: 'Primary Link',
  render: () => html`<sme-link primary>Go Here!</sme-link>`,
};

export const Secondary: StoryObj = {
  name: 'Secondary Link',
  render: () => html`<sme-link secondary>Go Here!</sme-link>`,
};
