import { type Page, type Locator } from '@playwright/test';
import { ROUTES } from '@constants/index';

export class LoginPage {
  readonly page: Page;

  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorBanner: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.loginButton = page.getByTestId('login-submit-btn');
    this.errorBanner = page.getByTestId('login-error-banner');
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN);
    await this.page.waitForURL(`**${ROUTES.LOGIN}`);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorBanner.waitFor({ state: 'visible' });
    return this.errorBanner.innerText();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
}
