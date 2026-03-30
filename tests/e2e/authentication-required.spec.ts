import { expect, test } from '../../fixtures/authenticated-test';

test('all e2e flows should start authenticated', async ({ page }) => {
  await page.goto('https://sauce-demo.myshopify.com/');
  await expect(page.getByRole('link', { name: /Log Out|Log out/i })).toBeVisible();
});
