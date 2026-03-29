import { expect, test } from '../fixtures/authenticated-test';
import { CatalogCheckoutPage } from '../page-objects/catalog-checkout-page';

test('catalog -> add 2 products -> cart count -> checkout -> payment methods', async ({ page }) => {
  const catalogCheckoutPage = new CatalogCheckoutPage(page);

  await catalogCheckoutPage.gotoHome();
  await catalogCheckoutPage.openCatalogFromMenu();
  await catalogCheckoutPage.assertCatalogPage();

  await catalogCheckoutPage.addProductToCartByName('Grey jacket');
  await catalogCheckoutPage.assertCartCountText('My Cart (1)');

  await catalogCheckoutPage.gotoCatalogByUrl();
  await catalogCheckoutPage.addProductToCartByName('Noir jacket');
  await catalogCheckoutPage.assertCartCountText('My Cart (2)');

  await catalogCheckoutPage.openCartFromHeader();
  await catalogCheckoutPage.proceedToCheckout();

  const paymentMethods = await catalogCheckoutPage.completeCheckoutUntilPaymentAndGetMethods();

  await expect(catalogCheckoutPage.paymentHeading).toBeVisible();
  await expect(catalogCheckoutPage.paymentHeading).toHaveText(/Payment/i);
  expect(paymentMethods.length, 'No payment methods were found at checkout.').toBeGreaterThan(0);

  await catalogCheckoutPage.placeOrderWithBogusCard();
  await catalogCheckoutPage.openMyAccountAndAssertShoppingHistory();

  test.info().annotations.push({
    type: 'payment-methods',
    description: paymentMethods.join(', '),
  });
});
