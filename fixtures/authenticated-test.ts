import { expect, test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';

export const test = base;
export { expect };

test.beforeEach(async ({ page }) => {
  const email = process.env.SAUCE_DEMO_EMAIL ?? '';
  const password = process.env.SAUCE_DEMO_PASSWORD ?? '';

  test.skip(
    !email || !password,
    'Set SAUCE_DEMO_EMAIL and SAUCE_DEMO_PASSWORD to run authenticated tests.',
  );

  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, password);
  await login.assertLoggedIn();
});
