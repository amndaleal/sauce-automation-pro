import { expect, test } from '../../fixtures/authenticated-test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('cart management should keep correct item count and prices', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.goto();
  await home.openCatalog();

  await catalog.assertProductVisible('Grey jacket');
  await catalog.openProduct('Grey jacket');
  await product.assertOnProductDetail('Grey jacket');
  await product.addToCart();
  await catalog.assertCartCount(1);

  await page.goto('https://sauce-demo.myshopify.com/collections/all');
  await expect(page).toHaveURL(/\/collections\/all/);
  await catalog.openProduct('Noir jacket');
  await product.assertOnProductDetail('Noir jacket');
  await product.addToCart();
  await catalog.assertCartCount(2);

  await cart.openFromHeader();
  await cart.assertItemAndPrice('Grey jacket', '£55.00');
  await cart.assertItemAndPrice('Noir jacket', '£60.00');
});

