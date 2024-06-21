import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/molecules/carousel';
import '../../exports/lib/atoms/carousel-item';
import '../../exports/lib/atoms/fab';

export default {
  title: 'Molecules/Carousel',
  component: 'sme-carousel',
} as Meta;

export const Default: StoryObj = {
  args: {
    nrOfSlidesToShow: 4,
    carouselItems: [
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
