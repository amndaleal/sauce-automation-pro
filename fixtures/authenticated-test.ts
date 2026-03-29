import { expect, test as base } from '@playwright/test';

export const test = base;
export { expect };

test.beforeEach(async ({ page }) => {
  await page.goto('https://sauce-demo.myshopify.com/');
  await expect(page.getByRole('link', { name: 'My Account' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Log Out|Log out/i })).toBeVisible();
});
