import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/molecules/getting-started-step';

export default {
  title: 'Molecules/Getting Started Step',
} as Meta;

export const Default: StoryObj = {
  render: () => html`
    <sme-getting-started-step class="col-span-2 self-center" title="⚒️ Step Title">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac
      neque.
    </sme-getting-started-step>
  `,
};
