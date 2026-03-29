import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { CheckoutPage } from '../../pages/checkout-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('checkout workflow should reach payment step with valid required data', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await home.goto();
  await home.openCatalog();

  await catalog.openProduct('Grey jacket');
  await product.addToCart();
  await catalog.assertCartCount(1);

  await cart.openFromHeader();
  await cart.proceedToCheckout();

  await checkout.fillRequiredDetailsAndReachPayment();
  await expect(checkout.paymentHeading).toBeVisible();
  await expect(page).toHaveURL(/\/checkouts?\//);
});
