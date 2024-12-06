import '../../lib/organisms/top-bar';
import '../../lib/atoms/buttons/button';
import '../../lib/atoms/loader';

import { html } from 'lit';

import type { Meta, StoryObj } from '@storybook/web-components';

export default {
  title: 'Organisms/Top Bar',
  component: 'sme-top-bar',
} as Meta;

export const TopBarWithUserProfile = {
  name: 'Top Bar with user profile',
  args: {
    loading: true,
  },
  render({ loading }) {
    return html`
      <sme-top-bar logoUrl="https://stryker-mutator.io/images/stryker.svg">
        <sme-loader slot="right-side" ?loading=${loading}>
          <sme-button type="subtle">Sign in with GitHub</sme-button>
        </sme-loader>
      </sme-top-bar>
    `;
  },
};

export const Default: StoryObj = {};
