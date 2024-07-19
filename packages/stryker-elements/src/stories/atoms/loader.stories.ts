import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/loader';

export default {
  title: 'Atoms/Loader',
} as Meta;

export const Default: StoryObj = {
  name: 'When loading',
  render: () => html` <sme-loader><h1>Hello world!</h1></sme-loader>`,
};

export const Loaded: StoryObj = {
  name: 'When loaded',
  render: () => {
    return html`<sme-loader ?doneWithLoading=${true}><h1>Hello world!</h1></sme-loader>`;
  },
};
