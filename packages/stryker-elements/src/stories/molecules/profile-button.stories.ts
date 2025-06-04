import '../../lib/atoms/buttons/button';
import '../../lib/atoms/link';
import '../../lib/molecules/loader';
import '../../lib/molecules/profile-button';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Molecules/Profile Button',
  component: 'sme-profile-button',
} as Meta;

export const Default: StoryObj = {
  name: 'Right Alignment',
  render: () => {
    return html`
      <div style="display: flex; justify-content: flex-end;">
        <sme-profile-button avatarUrl="/images/stryker.svg"></sme-profile-button>
      </div>
    `;
  },
};

export const LeftAlignment: StoryObj = {
  args: {
    avatarUrl: '/images/stryker.svg',
    direction: 'left',
  },
};

export const Loading: StoryObj = {
  args: {
    loading: true,
  },
  render: ({ loading }) => {
    return html`
      <sme-loader slot="right-side" ?loading=${loading}>
        <sme-profile-button avatarUrl="/images/stryker.svg"></sme-profile-button>
      </sme-loader>
    `;
  },
};
