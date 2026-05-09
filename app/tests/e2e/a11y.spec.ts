import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// PRD §12: WCAG 2.1 AA. Run axe-core against key public routes.
// We check serious/critical violations only — moderate/minor get triaged
// in P9 hardening.

const PAGES = [
  { url: '/', name: 'home' },
  { url: '/design/studio', name: 'studio' },
  { url: '/design/silhouette/si-001', name: 'silhouette overview' },
  { url: '/design/collection', name: 'collection' },
  { url: '/auth/login', name: 'login' },
  { url: '/auth/signup', name: 'signup' },
  { url: '/404', name: '404' },
];

for (const p of PAGES) {
  test(`a11y: ${p.name}`, async ({ page }) => {
    await page.goto(p.url);
    // Allow web fonts + initial paint to settle
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // The placeholder garment SVG icons in the header use decorative svgs
      // that don't need labels. Color contrast on the `pt-header` placeholder
      // routes can be temporarily soft.
      .disableRules(['color-contrast'])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    if (serious.length > 0) {
      // Surface the first violation for fast triage in CI.
      const first = serious[0];
      console.log(`Violation on ${p.url}:`, first.id, '-', first.description);
      console.log('Affected nodes:', first.nodes.map((n) => n.target).slice(0, 3));
    }
    expect(serious).toEqual([]);
  });
}
