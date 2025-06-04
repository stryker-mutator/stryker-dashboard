import '../../lib/atoms/badge';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Atoms/Badge',
  render: () => html`<sme-badge score="60" slug="github.com/stryker-mutator/stryker-js/master"></sme-badge>`,
} as Meta;

export const Default: StoryObj = {};
