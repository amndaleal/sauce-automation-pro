import { expect, Locator, Page } from '@playwright/test';
import { waitForLoading } from '../helpers/wait-helper';

export class CartPage {
  readonly page: Page;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutLink = page.getByRole('link', { name: 'Check Out' });
  }

  async openFromHeader(): Promise<void> {
    await this.checkoutLink.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async assertItemAndPrice(productName: string, productPrice: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first()).toBeVisible();
    await expect(this.page.getByText(productPrice).last()).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    const checkoutButton = this.page.getByRole('button', { name: /Check Out/i });
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/checkouts?\//);
  }
}
