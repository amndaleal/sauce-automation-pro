import { expect, Locator, Page } from '@playwright/test';
import { waitForLoading } from '../helpers/wait-helper';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: /Add to cart/i });
  }

  async assertOnProductDetail(productName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: productName })).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async addToCart(): Promise<void> {
    const addToCartRequest = this.page.waitForResponse((response) => {
      return response.url().includes('/cart/add.js') && response.request().method() === 'POST';
    });

    await this.addToCartButton.click();
    await addToCartRequest;
    await waitForLoading(this.page);
  }

  async addToCartAndGetBackendStatus(): Promise<number> {
    const addToCartRequest = this.page.waitForResponse((response) => {
      return response.url().includes('/cart/add.js') && response.request().method() === 'POST';
    });

    await this.addToCartButton.click();
    const response = await addToCartRequest;
    await waitForLoading(this.page);
    return response.status();
  }
}
