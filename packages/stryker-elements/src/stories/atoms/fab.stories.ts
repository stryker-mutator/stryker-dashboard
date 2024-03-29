import { Meta, StoryObj } from '@storybook/web-components';

import '../../exports/lib/atoms/fab';

export default {
  title: 'Atoms/FAB',
  component: 'sme-fab',
} as Meta;

export const Default: StoryObj = {
  args: {
    icon: 'chevron-left',
  },
};
