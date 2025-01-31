// Tailwind CSS
import '../src/tailwind-styles/component.css';

import type { Preview } from '@storybook/web-components';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#262626' }] },
  },
};

export default preview;
