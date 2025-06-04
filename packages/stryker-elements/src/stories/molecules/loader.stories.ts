import '../../lib/molecules/loader';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Molecules/Loader',
  component: 'sme-loader',
} as Meta;

export const Default: StoryObj = {
  name: 'When loading',
  render: () =>
    html`<sme-loader useSpinner
      ><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader
    >`,
};

export const Loaded: StoryObj = {
  name: 'When loaded',
  render: () => {
    return html`<sme-loader useSpinner .loading=${false}
      ><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader
    >`;
  },
};

export const FullCycle: StoryObj = {
  name: 'Full cycle',
  args: {
    loading: true,
  },
  render: ({ loading }) => {
    return html`<sme-loader useSpinner .loading=${loading}
      ><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader
    >`;
  },
};
