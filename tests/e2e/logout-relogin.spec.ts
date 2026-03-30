import { expect, test } from '@playwright/test';
import { LoginPage } from '../../page-objects/login-page';

test('authenticated user can log out and log in again', async ({ page }) => {
  const email = process.env.SAUCE_DEMO_EMAIL ?? '';
  const password = process.env.SAUCE_DEMO_PASSWORD ?? '';
  const login = new LoginPage(page);

  test.skip(!email || !password, 'Set SAUCE_DEMO_EMAIL and SAUCE_DEMO_PASSWORD to run authentication lifecycle test.');

  await login.goto();
  await login.login(email, password);
  await login.assertLoggedIn();

  await login.logout();
  await expect(page).toHaveURL(/\/account\/login/);

  await login.login(email, password);
  await login.assertLoggedIn();
});
