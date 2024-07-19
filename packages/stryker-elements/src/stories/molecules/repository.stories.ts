import { Meta, StoryObj } from '@storybook/web-components';

import '../../lib/molecules/repository';

export default {
  title: 'Molecules/Repository',
  component: 'sme-repository',
} as Meta;

export const Default: StoryObj = {
  args: {
    name: 'stryker-mutator/stryker',
    currentStep: 907,
    totalSteps: 1000,
  },
};
