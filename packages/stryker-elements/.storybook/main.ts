import { dirname, join } from 'node:path';

import type { StorybookConfig } from '@storybook/web-components-vite';

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: getAbsolutePath('@storybook/web-components-vite'),
    options: {},
  },
};
export default config;
