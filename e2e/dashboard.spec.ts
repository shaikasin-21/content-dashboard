import { test, expect } from '@playwright/test';
test('search updates results after debounce', async ({ page }) => {
  await page.goto('/'); await expect(page.getByTestId('card').first()).toBeVisible();
  await page.getByLabel('Search content').fill('robots');
  await expect(page.getByText('Results for “robots”')).toBeVisible();
});
test('favorite shows on favorites page', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: /add to favorites/i }).first().click();
  await page.getByRole('link', { name: 'Favorites' }).click();
  await expect(page.getByTestId('card')).toHaveCount(1);
});
test('dark mode persists across reload', async ({ page }) => {
  await page.goto('/'); await page.getByLabel('Toggle dark mode').click();
  await page.reload(); await expect(page.locator('html')).toHaveClass(/dark/);
});
test('drag reorders cards via keyboard', async ({ page }) => {
  await page.goto('/'); const h = page.getByTestId('drag-handle');
  await expect(h.nth(1)).toBeVisible();
  const first = await page.getByTestId('sortable').first().getAttribute('data-id');
   await h.first().focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await expect(page.getByTestId('sortable').first()).not.toHaveAttribute('data-id', first!);
});
