import { expect, test } from '../../fixtures/authenticated-test';
import { CatalogPage } from '../../pages/catalog-page';
import { HomePage } from '../../pages/home-page';
import { ProductPage } from '../../pages/product-page';

test('product discovery by search should open Grey jacket detail page', async ({ page }) => {
  const home = new HomePage(page);
  const catalog = new CatalogPage(page);
  const product = new ProductPage(page);

  await home.goto();
  await home.searchProduct('Grey jacket');

  await catalog.assertProductVisible('Grey jacket');
  await catalog.openProduct('Grey jacket');

  await product.assertOnProductDetail('Grey jacket');
  await expect(page).toHaveURL(/\/products\/grey-jacket/);
});

