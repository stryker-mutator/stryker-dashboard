import '../../lib/atoms/labeled-container';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Atoms/Labeled Container',
} as Meta;

export const Default: StoryObj = {
  render: () => html`<sme-labeled-container>Go Here!</sme-labeled-container>`,
};
