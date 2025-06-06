import '../../lib/atoms/list';

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

export default {
  title: 'Atoms/List',
} as Meta;

export const NoItems: StoryObj = {
  name: 'With no items',
  render: () => html`<sme-list></sme-list>`,
};

export const OneItem: StoryObj = {
  name: 'With one item',
  render: () => {
    return html`
      <sme-list>
        <span>Hello World!</span>
      </sme-list>
    `;
  },
};

export const MultipleItems: StoryObj = {
  name: 'With multiple items',
  render: () => {
    return html`
      <sme-list>
        <span>Hello World!</span>
        <span>Hello World!</span>
        <span>Hello World!</span>
        <span>Hello World!</span>
      </sme-list>
    `;
  },
};
