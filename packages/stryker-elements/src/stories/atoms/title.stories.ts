import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/title';

export default {
  title: 'Atoms/Title',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<sme-title>I am a title</sme-title>`,
};
