import '../../lib/molecules/collapsible';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Molecules/Collapsible',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-collapsible title="foo">Click here!</sme-collapsible>`,
};
