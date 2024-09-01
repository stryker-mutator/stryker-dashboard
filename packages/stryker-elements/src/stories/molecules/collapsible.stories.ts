import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/molecules/collapsible';

export default {
  title: 'Molecules/Collapsible',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-collapsible title="foo">Click here!</sme-collapsible>`,
};
