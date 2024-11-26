import '../../lib/atoms/notify';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Atoms/Notify',
} as Meta;

export const Error: StoryObj = {
  name: 'When it is an error',
  render: () => html`<sme-notify>Something went terribly wrong...</sme-notify>`,
};

export const Info: StoryObj = {
  name: 'When it is a notification',
  render: () => {
    return html`<sme-notify type="info">Just letting you know...</sme-notify>`;
  },
};
