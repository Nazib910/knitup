import { test, expect } from '@playwright/test';

// Happy-path E2E: walk the entire 7-step wizard from Studio to Add to Cart.
// PRD §13. Uses real MSW mock API + real Three.js scene.

test.describe('wizard happy path', () => {
  test('Studio → Customise → Material → Construction → Stitch → Gauge → Color → Size → Add to Cart', async ({ page }) => {
    // 1. Studio
    await page.goto('/design/studio');
    await expect(page.getByText("Men's Oversized Crew Neck Pullover").first()).toBeVisible();

    // Click first silhouette card
    await page.getByLabel("Men's Oversized Crew Neck Pullover").click();

    // 2. Silhouette overview
    await expect(page.getByRole('heading', { name: /Men's Oversized Crew Neck Pullover/ })).toBeVisible();
    await expect(page.getByText('Step 1 of 7')).toBeVisible();
    await page.getByRole('button', { name: 'Customise' }).click();

    // 3. Material
    await expect(page).toHaveURL(/\/design\/material/);
    await expect(page.getByText('Step 2 of 7')).toBeVisible();
    // Pick the first material card (Bliss)
    await page.getByRole('button', { name: 'Bliss' }).first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 4. Construction
    await expect(page).toHaveURL(/\/design\/construction/);
    await page.getByRole('button', { name: /Choose Stitch Pattern/ }).click();

    // 5. Stitch
    await expect(page).toHaveURL(/\/design\/stitch/);
    await page.getByLabel('Plain', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 6. Gauge
    await expect(page).toHaveURL(/\/design\/gauge/);
    await page.getByRole('button', { name: /12GG Finer/ }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 7. Color
    await expect(page).toHaveURL(/\/design\/color/);
    await page.getByLabel('Snow', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // 8. Size & Quantity
    await expect(page).toHaveURL(/\/design\/sizeAndQuantity/);
    await expect(page.getByText('Step 7 of 7')).toBeVisible();
    await expect(page.getByText('Design Saved')).toBeVisible();

    // Increase qty for size M
    await page.getByLabel('Quantity for size M').getByRole('button', { name: 'Increase' }).click();
    await page.getByLabel('Quantity for size M').getByRole('button', { name: 'Increase' }).click();

    // Add to Cart
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Added to your cart')).toBeVisible();

    // Cart badge shows 2
    await expect(page.locator('header sup').first()).toHaveText('2');
  });
});

test.describe('cart drawer', () => {
  test('opens from header cart icon and shows empty state', async ({ page }) => {
    await page.goto('/design/studio');
    await page.getByLabel(/^Cart \(/).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});

test.describe('routing', () => {
  test('marketing homepage renders hero CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Custom knitwear/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Creating' })).toBeVisible();
  });

  test('404 page redirects unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page).toHaveURL(/\/404/);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('wizard guard bounces back to studio when selection is empty', async ({ page }) => {
    await page.goto('/design/material');
    await expect(page).toHaveURL(/\/design\/studio/);
  });
});
