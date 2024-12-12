import '../../lib/molecules/collapsible';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Molecules/Collapsible',
} as Meta;

export const Default: StoryObj = {
  args: {
    title: 'foo',
    content: 'Click here!',
    opened: false,
  },
  render: ({ title, content, opened }) =>
    html`<sme-collapsible title="${title}" ?opened="${opened}">${content}</sme-collapsible>`,
};
