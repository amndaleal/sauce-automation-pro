import { expect, test } from '../fixtures/authenticated-test';

test('home autenticada deve exibir links principais', async ({ page }) => {
  await page.goto('https://sauce-demo.myshopify.com/');
  await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
  await expect(page.getByRole('link', { name: /My Cart \(/i })).toBeVisible();
});

test('my account deve abrir com historico de pedidos', async ({ page }) => {
  await page.goto('https://sauce-demo.myshopify.com/account');
  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Order History' })).toBeVisible();
});
