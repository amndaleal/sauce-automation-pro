import { expect, test } from '../fixtures/authenticated-test';

test('sessao autenticada deve exibir acesso ao my account', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'My Account' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Log Out|Log out/i })).toBeVisible();
});
