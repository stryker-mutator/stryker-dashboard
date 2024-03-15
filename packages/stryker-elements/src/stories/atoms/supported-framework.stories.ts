import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/atoms/supported-framework';

export default {
  title: 'Atoms/Supported Framework',
  component: 'sme-supported-framework',
} as Meta;

export const Default: StoryObj = {
  args: {
    name: 'stryker-js',
    logo: 'https://stryker-mutator.io/images/stryker.svg',
    url: 'https://github.com/stryker-mutator/stryker-js',
  },
};
