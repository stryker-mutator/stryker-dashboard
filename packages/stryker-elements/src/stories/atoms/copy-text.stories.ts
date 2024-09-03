import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/copy-text';

export default {
  title: 'Atoms/Copy Text',
} as Meta;

export const ToggleButton: StoryObj = {
  name: 'Default',
  render: () => html`<sme-copy-text>foobar, this should be copied</sme-copy-text>`,
};
