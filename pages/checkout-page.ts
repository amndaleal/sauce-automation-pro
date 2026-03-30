import { expect, Locator, Page } from '@playwright/test';
import { randomUUID } from 'crypto';

export class CheckoutPage {
  readonly page: Page;
  readonly paymentHeading: Locator;
  readonly payNowButton: Locator;
  readonly myAccountHeading: Locator;
  readonly orderHistoryHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' });
    this.payNowButton = page.getByRole('button', { name: 'Pay now' });
    this.myAccountHeading = page.getByRole('heading', { name: 'My Account' });
    this.orderHistoryHeading = page.getByRole('heading', { name: 'Order History' });
  }

  async fillRequiredDetailsAndReachPayment(): Promise<void> {
    const uniqueId = randomUUID().slice(0, 8);
    const postalCodeInput = this.page
      .getByRole('combobox', { name: /Postal code|ZIP code|CEP/i })
      .or(this.page.getByRole('textbox', { name: /Postal code|ZIP code|CEP/i }));

    await expect(this.page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Email' }).fill(`qa.${uniqueId}@example.com`);

    await this.page.getByRole('textbox', { name: 'First name (optional)' }).fill('QA');
    await this.page.getByRole('textbox', { name: 'Last name' }).fill('Automation');
    await expect(postalCodeInput).toBeVisible({ timeout: 15000 });
    await postalCodeInput.fill('01001000');
    await this.page.getByRole('textbox', { name: 'Address' }).fill('123 Test Street');
    await this.page.getByRole('textbox', { name: 'City' }).fill('Sao Paulo');

    await expect(this.paymentHeading).toBeVisible();
    await expect(this.payNowButton).toBeEnabled();
  }

  async submitBogusCardPayment(): Promise<void> {
    await this.page
      .frameLocator('iframe[title*="Card number"]')
      .getByRole('textbox', { name: /Card number/i })
      .fill('1');
    await this.page
      .frameLocator('iframe[title*="Expiration date"]')
      .getByRole('textbox', { name: /Expiration date/i })
      .fill('12/34');
    await this.page
      .frameLocator('iframe[title*="Security code"]')
      .getByRole('textbox', { name: /Security code/i })
      .fill('123');
    await this.page
      .frameLocator('iframe[title*="Name on card"]')
      .getByRole('textbox', { name: /Name on card/i })
      .fill('QA Automation');

    await expect(this.payNowButton).toBeEnabled();
    await this.payNowButton.click();
  }

  async assertOrderSuccess(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Thank you|Order confirmed/i }).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async scrapePurchasedProductsFromAccount(): Promise<string[]> {
    await this.page.goto('https://sauce-demo.myshopify.com/account');
    await expect(this.myAccountHeading).toBeVisible();
    await expect(this.orderHistoryHeading).toBeVisible();

    const orderHistorySection = this.orderHistoryHeading.locator('..');
    await expect(orderHistorySection).toBeVisible();

    const productLinkTexts = (await orderHistorySection.getByRole('link').allTextContents())
      .map((text) => text.trim())
      .filter((text) => text.length > 0);

    return Array.from(new Set(productLinkTexts));
  }
}
