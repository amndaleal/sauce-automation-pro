import { expect, test } from '../fixtures/authenticated-test';

test('authenticated session should display my account access', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'My Account' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Log Out|Log out/i })).toBeVisible();
});
