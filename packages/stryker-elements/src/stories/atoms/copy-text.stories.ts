import '../../lib/atoms/copy-text';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Atoms/Copy Text',
} as Meta;

export const ToggleButton: StoryObj = {
  name: 'Default',
  render: () => html`<sme-copy-text>foobar, this should be copied</sme-copy-text>`,
};
