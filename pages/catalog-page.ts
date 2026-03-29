import { expect, Locator, Page } from '@playwright/test';
import { waitForLoading } from '../helpers/wait-helper';

export class CatalogPage {
  readonly page: Page;
  readonly myCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myCartLink = page.getByRole('link', { name: /My Cart \(/i });
  }

  productLink(productName: string): Locator {
    return this.page.getByRole('link').filter({ hasText: productName }).first();
  }

  async assertProductVisible(productName: string): Promise<void> {
    await expect(this.productLink(productName)).toBeVisible();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productLink(productName).click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/products\//);
  }

  async assertCartCount(expectedCount: number): Promise<void> {
    await expect(this.myCartLink).toHaveText(`My Cart (${expectedCount})`);
  }
}
