import { expect, Locator, Page } from '@playwright/test';
import { randomUUID } from 'crypto';

export class CheckoutPage {
  readonly page: Page;
  readonly paymentHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' });
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
    await expect(this.page.getByRole('button', { name: 'Pay now' })).toBeEnabled();
  }
}
