import { expect, test } from '../../fixtures/authenticated-test';
import { CartPage } from '../../pages/cart-page';
import { CatalogPage } from '../../pages/catalog-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('cart should recalculate total after quantity update', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  await home.goto();
  await home.openCatalog();
  await catalog.openProduct('Grey jacket');
  await product.addToCart();

  await cart.openFromHeader();
  await cart.updateQuantity('Grey jacket', '2');
  await expect(page.getByRole('heading', { name: /Total.*110\.00/i })).toBeVisible();
});
