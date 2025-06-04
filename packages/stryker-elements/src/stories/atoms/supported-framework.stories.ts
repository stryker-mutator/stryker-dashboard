import '../../lib/atoms/supported-framework';

import type { StoryObj } from '@storybook/web-components-vite';

export default {
  title: 'Atoms/Supported Framework',
  component: 'sme-supported-framework',
};

export const Default: StoryObj = {
  args: {
    name: 'stryker-js',
    logo: '/images/stryker.svg',
    url: 'https://github.com/stryker-mutator/stryker-js',
  },
};
