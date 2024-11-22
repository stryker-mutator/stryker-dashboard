import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/molecules/tab-panels';

export default {
  title: 'Molecules/Tab Panels',
  component: 'sme-tab-panels',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => {
    return html`<sme-tab-panels
      .tabs="${['Report', 'Compare']}"
      .panels="${[html`<div>report</div>`, html`<div>compare</div>`]}"
    ></sme-tab-panels>`;
  },
};
