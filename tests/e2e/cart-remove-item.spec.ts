import { test } from '../../fixtures/authenticated-test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('cart should update to zero after removing the only item', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.goto();
  await home.openCatalog();
  await catalog.openProduct('Grey jacket');
  await product.addToCart();
  await catalog.assertCartCount(1);

  await cart.openFromHeader();
  await cart.removeItem('Grey jacket');
  await catalog.assertCartCount(0);
});
