import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../../lib/molecules/toggle-repository';

export default {
  title: 'Molecules/Toggle Repository',
  component: 'sme-toggle-repository',
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  render: () => {
    return html`<sme-toggle-repository name="GitHub.com/MyRepository"></sme-toggle-repository>`;
  },
};

export const Checked: StoryObj = {
  name: 'Checked',
  render: () => {
    return html`
      <sme-toggle-repository
        @repositoryClicked="${() => console.log('foo')}"
        name="GitHub.com/MyRepository"
        enabled
      ></sme-toggle-repository>
    `;
  },
};
