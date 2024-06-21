import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/atoms/carousel-item';

export default {
  title: 'Atoms/Carousel Item',
  component: 'sme-carousel-item',
} as Meta;

export const Default: StoryObj = {
  args: {
    name: 'stryker-js',
    logo: 'https://stryker-mutator.io/images/stryker.svg',
    url: 'https://github.com/stryker-mutator/stryker-js',
  },
};
