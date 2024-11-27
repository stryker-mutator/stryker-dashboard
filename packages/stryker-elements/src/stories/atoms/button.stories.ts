import '../../lib/atoms/buttons/button';
import '../../lib/atoms/buttons/toggle-button';

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

export default {
  title: 'Atoms/Buttons',
  render: () => html`<sme-button>Click here!</sme-button>`,
} as Meta;

export const Default: StoryObj = {};

export const ToggleButton: StoryObj = {
  name: 'Toggle Button',
  render: () => html`<sme-toggle-button></sme-toggle-button>`,
};
