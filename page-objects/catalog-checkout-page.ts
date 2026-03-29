import { expect, Locator, Page } from '@playwright/test';
import { randomUUID } from 'crypto';

export class CatalogCheckoutPage {
  readonly page: Page;
  readonly catalogMenuLink: Locator;
  readonly productGridLinks: Locator;
  readonly addToCartButton: Locator;
  readonly myCartLink: Locator;
  readonly headerCheckoutLink: Locator;
  readonly cartCheckoutButton: Locator;
  readonly paymentHeading: Locator;
  readonly paymentGroup: Locator;
  readonly payNowButton: Locator;
  readonly myAccountLink: Locator;
  readonly myAccountHeading: Locator;
  readonly orderHistoryHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.catalogMenuLink = page.getByRole('link', { name: 'Catalog' });
    this.productGridLinks = page.getByRole('link');
    this.addToCartButton = page.getByRole('button', { name: /Add to cart/i });
    this.myCartLink = page.getByRole('link', { name: /My Cart \(/i });
    this.headerCheckoutLink = page.getByRole('link', { name: 'Check Out' });
    this.cartCheckoutButton = page.getByRole('button', { name: /Check Out/i });
    this.paymentHeading = page.getByRole('heading', { name: /Payment/i });
    this.paymentGroup = page.getByRole('group', { name: 'Payment' });
    this.payNowButton = page.getByRole('button', { name: 'Pay now' });
    this.myAccountLink = page.getByRole('link', { name: 'My Account' });
    this.myAccountHeading = page.getByRole('heading', { name: 'My Account' });
    this.orderHistoryHeading = page.getByRole('heading', { name: 'Order History' });
  }

  async gotoHome(): Promise<void> {
    await this.page.goto('https://sauce-demo.myshopify.com/');
    await expect(this.catalogMenuLink).toBeVisible();
  }

  async openCatalogFromMenu(): Promise<void> {
    await this.catalogMenuLink.click();
    await expect(this.page).toHaveURL(/\/collections\/all/);
  }

  async gotoCatalogByUrl(): Promise<void> {
    await this.page.goto('https://sauce-demo.myshopify.com/collections/all');
    await expect(this.page).toHaveURL(/\/collections\/all/);
  }

  async assertCatalogPage(): Promise<void> {
    await expect(this.page.getByRole('link').filter({ hasText: 'Grey jacket' }).first()).toBeVisible();
    await expect(this.page.getByRole('link').filter({ hasText: 'Noir jacket' }).first()).toBeVisible();
  }

  async addProductToCartByName(productName: string): Promise<void> {
    const productLink = this.productGridLinks.filter({ hasText: productName }).first();
    await expect(productLink).toBeVisible();
    await productLink.click();
    await expect(this.addToCartButton).toBeVisible();

    const addToCartRequest = this.page.waitForResponse((response) => {
      return response.url().includes('/cart/add.js') && response.request().method() === 'POST';
    });

    await this.addToCartButton.click();
    await addToCartRequest;
  }

  async assertCartCountText(expectedText: string): Promise<void> {
    await expect(this.myCartLink).toHaveText(expectedText);
  }

  async openCartFromHeader(): Promise<void> {
    await expect(this.headerCheckoutLink).toBeVisible();
    await this.headerCheckoutLink.click();
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.cartCheckoutButton).toBeEnabled();
    await this.cartCheckoutButton.click();
    await expect(this.page).toHaveURL(/\/checkouts?\//);
  }

  async completeCheckoutUntilPaymentAndGetMethods(): Promise<string[]> {
    const checkoutId = randomUUID().slice(0, 8);
    const email = `qa.checkout.${checkoutId}@example.com`;

    await expect(this.page.getByPlaceholder(/Email/i)).toBeVisible();
    await this.page.getByPlaceholder(/Email/i).fill(email);
    await this.page.getByPlaceholder(/First name/i).fill('QA');
    await this.page.getByPlaceholder(/Last name/i).fill('Automation');
    await this.page.getByPlaceholder(/^Address/i).fill('123 Test Street');
    await this.page.getByPlaceholder(/City/i).fill('Sao Paulo');
    await this.page.getByPlaceholder(/Postal code/i).fill('01001000');

    await expect(this.paymentHeading).toBeVisible();
    const paymentMethodHeadings = this.paymentGroup.getByRole('heading', { level: 3 });
    await expect(paymentMethodHeadings.first()).toBeVisible();
    const paymentTexts = await paymentMethodHeadings.allTextContents();
    const normalized = paymentTexts.map((text) => text.trim()).filter((text) => text.length > 0);
    return Array.from(new Set(normalized));
  }

  async placeOrderWithBogusCard(): Promise<void> {
    await this.page
      .frameLocator('iframe[title*=\"Card number\"]')
      .getByRole('textbox', { name: 'Card number' })
      .fill('1');
    await this.page
      .frameLocator('iframe[title*=\"Expiration date\"]')
      .getByRole('textbox', { name: /Expiration date/i })
      .fill('12/34');
    await this.page
      .frameLocator('iframe[title*=\"Security code\"]')
      .getByRole('textbox', { name: 'Security code' })
      .fill('123');
    await this.page
      .frameLocator('iframe[title*=\"Name on card\"]')
      .getByRole('textbox', { name: 'Name on card' })
      .fill('QA Automation');

    await expect(this.payNowButton).toBeEnabled();
    await this.payNowButton.click();
    await expect(this.page.getByRole('heading', { name: /Thank you|Order confirmed/i }).first()).toBeVisible();
  }

  async openMyAccountAndAssertShoppingHistory(): Promise<void> {
    await this.page.goto('https://sauce-demo.myshopify.com/account');
    await expect(this.myAccountHeading).toBeVisible();
    await expect(this.orderHistoryHeading).toBeVisible();
    await expect(this.page.getByText(/Noir jacket|Grey jacket/i).first()).toBeVisible();
  }
}
