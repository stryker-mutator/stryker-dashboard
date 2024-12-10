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
  },
  render: ({ title, content }) => html`<sme-collapsible title="${title}">${content}</sme-collapsible>`,
};
