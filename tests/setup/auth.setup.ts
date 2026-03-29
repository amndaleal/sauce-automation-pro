import { mkdirSync } from 'fs';
import { expect, test } from '@playwright/test';

const AUTH_FILE = 'playwright/.auth/user.json';

test('create authenticated storage state', async ({ page, context }) => {
  const email = process.env.SAUCE_DEMO_EMAIL ?? '';
  const password = process.env.SAUCE_DEMO_PASSWORD ?? '';

  test.skip(
    !email || !password,
    'Skipping auth setup: define SAUCE_DEMO_EMAIL and SAUCE_DEMO_PASSWORD in CI secrets.',
  );

  await page.goto('https://sauce-demo.myshopify.com/account/login');
  await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('link', { name: 'My Account' })).toBeVisible({ timeout: 15000 });

  mkdirSync('playwright/.auth', { recursive: true });
  await context.storageState({ path: AUTH_FILE });
});
