import { axe } from 'jest-axe';

/**
 * Shared axe runner configured for WCAG 2.1 AA. One place (DRY) so every story
 * a11y assertion uses the same ruleset.
 */
export async function checkA11y(container: Element) {
  return axe(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  });
}
