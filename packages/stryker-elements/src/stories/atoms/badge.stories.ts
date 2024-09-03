import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/badge';

export default {
  title: 'Atoms/Badge',
  render: () => html`<sme-badge score="60" slug="github.com/stryker-mutator/stryker-js/master"></sme-badge>`,
} as Meta;

export const Default: StoryObj = {};
