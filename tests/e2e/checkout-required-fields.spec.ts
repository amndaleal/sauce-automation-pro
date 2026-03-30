import { test } from '../../fixtures/authenticated-test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { CheckoutPage } from '../../pages/checkout-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('checkout should keep payment blocked until required shipping data is provided', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await home.goto();
  await home.openCatalog();
  await catalog.openProduct('Grey jacket');
  await product.addToCart();

  await cart.openFromHeader();
  await cart.proceedToCheckout();

  await checkout.assertPaymentBlockedWithoutRequiredAddress();
});
