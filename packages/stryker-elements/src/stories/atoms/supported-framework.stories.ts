import { StoryObj } from '@storybook/web-components';
import '../../lib/atoms/supported-framework';

export default {
  title: 'Atoms/Supported Framework',
  component: 'sme-supported-framework',
};

export const Default: StoryObj = {
  name: 'Default',
  args: {
    name: 'stryker-js',
    logo: 'https://stryker-mutator.io/images/stryker.svg',
    url: 'https://github.com/stryker-mutator/stryker-js',
  },
};
