import type { Preview } from "@storybook/web-components";

// Tailwind CSS
import "../src/tailwind-styles/global.css";
import "../src/tailwind-styles/component.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
