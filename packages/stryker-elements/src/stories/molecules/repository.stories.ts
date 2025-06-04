import '../../lib/molecules/repository';

import type { Meta, StoryObj } from '@storybook/web-components-vite';

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
