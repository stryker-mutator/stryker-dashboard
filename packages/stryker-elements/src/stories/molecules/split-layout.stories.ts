import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/hr';
import '../../lib/molecules/split-layout';

export default {
  title: 'Molecules/Split Layout',
  component: 'sme-split-layout',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => {
    return html`
      <sme-split-layout>
        <div slot="left">Left</div>
        <div slot="right">Right</div>
      </sme-split-layout>
    `;
  },
};
