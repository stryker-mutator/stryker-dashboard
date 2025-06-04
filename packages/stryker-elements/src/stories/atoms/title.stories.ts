import '../../lib/atoms/title';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Atoms/Title',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-title>I am a title</sme-title>`,
};
