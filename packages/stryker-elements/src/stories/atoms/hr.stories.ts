import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/atoms/hr';

export default {
  title: 'Atoms/Hr',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => html`<sme-hr></sme-hr>`,
};

export const Vertical: StoryObj = {
  name: 'Vertical',
  render: () => html`<div style="height: 100px"><sme-hr direction="vertical"></sme-hr></div>`,
};
