import { expect, test } from '../../fixtures/authenticated-test';
import { CatalogPage } from '../../pages/catalog-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('add to cart should receive successful backend response', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);

  await home.goto();
  await home.openCatalog();
  await catalog.openProduct('Grey jacket');

  const addToCartStatus = await product.addToCartAndGetBackendStatus();
  expect(addToCartStatus).toBe(200);
  await catalog.assertCartCount(1);
});
