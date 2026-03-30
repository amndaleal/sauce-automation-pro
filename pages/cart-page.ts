import { expect, Locator, Page } from '@playwright/test';
import { waitForLoading } from '../helpers/wait-helper';

export class CartPage {
  readonly page: Page;
  readonly checkoutLink: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutLink = page.getByRole('link', { name: 'Check Out' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async openFromHeader(): Promise<void> {
    await this.checkoutLink.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async assertItemAndPrice(productName: string, productPrice: string): Promise<void> {
    const cartSection = this.page.getByRole('heading', { name: 'My Cart' }).locator('..');
    await expect(this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first()).toBeVisible();
    await expect(cartSection).toContainText(productPrice);
  }

  async removeItem(productName: string): Promise<void> {
    const cartSection = this.page.getByRole('heading', { name: 'My Cart' }).locator('..');
    await expect(cartSection.getByRole('link', { name: new RegExp(productName, 'i') }).first()).toBeVisible();
    await cartSection.getByRole('link', { name: 'x' }).first().click();
    await expect(cartSection.getByRole('link', { name: new RegExp(productName, 'i') })).toHaveCount(0);
  }

  async updateQuantity(productName: string, quantity: string): Promise<void> {
    const cartSection = this.page.getByRole('heading', { name: 'My Cart' }).locator('..');
    await expect(cartSection.getByRole('link', { name: new RegExp(productName, 'i') }).first()).toBeVisible();
    const quantityInput = cartSection.getByRole('textbox').first();
    await expect(quantityInput).toBeVisible();
    await quantityInput.fill(quantity);
    await this.updateButton.click();
    await expect(async () => {
      await expect(quantityInput).toHaveValue(quantity);
    }).toPass({ timeout: 10000 });
  }

  async proceedToCheckout(): Promise<void> {
    const checkoutButton = this.page.getByRole('button', { name: /Check Out/i });
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/checkouts?\//);
  }
}
