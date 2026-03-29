import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginHeader: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly myAccountLink: Locator;
  readonly logOutLink: Locator;
  readonly hcaptchaBadgeText: Locator;
  readonly globalSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginHeader = page.getByRole('heading', { name: 'Customer Login' });
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.myAccountLink = page.getByRole('link', { name: 'My Account' });
    this.logOutLink = page.getByRole('link', { name: /Log Out|Log out/i });
    this.hcaptchaBadgeText = page.getByText('Protected by hCaptcha');
    this.globalSearchInput = page.getByPlaceholder('Search');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://sauce-demo.myshopify.com/account/login');
    await expect(this.loginHeader).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeEnabled();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async assertLoggedIn(): Promise<void> {
    await expect(this.myAccountLink).toBeVisible();
    await expect(this.logOutLink).toBeVisible();
  }

  async assertAuthenticationFailed(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account\/login(?:\?.*)?$/);
    await expect(this.loginHeader).toBeVisible();
    await expect(this.signInButton).toBeEnabled();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.hcaptchaBadgeText).toBeVisible();
  }

  async logout(): Promise<void> {
    await expect(this.logOutLink).toBeVisible();
    await this.logOutLink.click();
    await expect(this.loginHeader).toBeVisible();
  }
}
