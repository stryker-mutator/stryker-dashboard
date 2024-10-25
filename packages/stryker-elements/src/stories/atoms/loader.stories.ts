import '../../lib/atoms/loader';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Atoms/Loader',
  component: 'sme-loader',
} as Meta;

export const Default: StoryObj = {
  name: 'When loading',
  render: () => html`<sme-loader><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader>`,
};

export const Loaded: StoryObj = {
  name: 'When loaded',
  render: () => {
    return html`<sme-loader ?doneWithLoading=${true}><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader>`;
  },
};

export const FullCycle: StoryObj = {
  name: 'Full cycle',
  args: {
    doneWithLoading: false,
  },
  render: ({ doneWithLoading }) => {
    return html`<sme-loader ?doneWithLoading=${doneWithLoading}><h2 class="mb-4 text-center text-2xl font-bold text-white">Supported Frameworks</h2></sme-loader>`;
  },
};
