import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/molecules/carousell';
import '../../exports/lib/atoms/supported-framework';

export default {
  title: 'Molecules/Carousell',
  component: 'sme-carousell',
} as Meta;

export const Default: StoryObj = {
  args: {
    carousellItems: [
      {
        name: 'StrykerJS',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Stryker.NET',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Stryker4s',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Infection',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'StrykerJS',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Stryker.NET',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Stryker4s',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
      {
        name: 'Infection',
        logo: 'https://stryker-mutator.io/images/stryker.svg',
        url: 'https://github.com/stryker-mutator/stryker-js',
      },
    ],
  },
};
