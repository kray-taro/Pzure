import type { Preview } from '@storybook/react';
import './tailwind.css';

/**
 * Global Storybook config. The a11y addon runs axe in the canvas so every story
 * is checked against WCAG AA interactively, complementing the CI axe tests.
 */
const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    controls: { expanded: true },
  },
};

export default preview;
