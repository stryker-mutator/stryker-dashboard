import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/buttons/button';
import '../../lib/atoms/link';
import '../../lib/molecules/profile-button';

export default {
  title: 'Molecules/Profile Button',
  component: 'sme-profile-button',
} as Meta;

export const Default: StoryObj = {
  name: 'Right Alignment',
  render: () => {
    return html`
      <div style="display: flex; justify-content: flex-end;">
        <sme-profile-button
          avatarUrl="https://stryker-mutator.io/images/stryker.svg"
        ></sme-profile-button>
      </div>
    `;
  },
};

export const LeftAlignment: StoryObj = {
  name: 'Left Alignment',
  args: {
    avatarUrl: 'https://stryker-mutator.io/images/stryker.svg',
    direction: 'left',
  },
};
