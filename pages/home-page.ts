import { expect, Locator, Page } from '@playwright/test';
import { waitForLoading } from '../helpers/wait-helper';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly catalogLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search').or(page.getByRole('textbox', { name: 'Search' }));
    this.searchSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.catalogLink = page.getByRole('link', { name: 'Catalog' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://sauce-demo.myshopify.com/');
    await expect(this.page.getByRole('heading', { name: 'Sauce Demo' })).toBeVisible({ timeout: 15000 });
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    await expect(this.catalogLink).toBeVisible();
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchSubmitButton.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/search/);
  }

  async openCatalog(): Promise<void> {
    await this.catalogLink.click();
    await waitForLoading(this.page);
    await expect(this.page).toHaveURL(/\/collections\/all/);
  }
}
