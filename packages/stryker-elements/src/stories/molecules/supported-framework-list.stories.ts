import { StoryObj } from "@storybook/web-components";

import '../../exports/lib/molecules/supported-framework-list';

export default {
  title: 'Molecules/Supported Framework List',
  component: 'sme-supported-framework-list',
  
};

export const Default: StoryObj = {
  argTypes: {
    spacing: {
      options: ['between', 'around'],
      control: { type: 'select' },
    },
  },
  args: {
    supportedFrameworks: [
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
