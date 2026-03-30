import { expect, test } from '../../fixtures/authenticated-test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { CheckoutPage } from '../../pages/checkout-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('authenticated user should complete purchase and find products in account order history', async ({ page }) => {
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
  await checkout.submitBogusCardPayment();
  await checkout.assertOrderSuccess();

  const purchasedProducts = await checkout.scrapePurchasedProductsFromAccount();
  expect(
    purchasedProducts.some((item) => /Grey jacket/i.test(item)),
    `Could not find purchased product in account history. Scraped items: ${purchasedProducts.join(', ')}`,
  ).toBeTruthy();
});

