import '../../lib/molecules/toggle-repository';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Molecules/Toggle Repository',
  component: 'sme-toggle-repository',
} as Meta;

export const Default: StoryObj = {
  render: () => {
    return html`<sme-toggle-repository name="GitHub.com/MyRepository"></sme-toggle-repository>`;
  },
};

export const Checked: StoryObj = {
  render: () => {
    return html`
      <sme-toggle-repository
        @repositoryClicked=${() => console.log('foo')}
        name="GitHub.com/MyRepository"
        enabled
      ></sme-toggle-repository>
    `;
  },
};
