import { test, expect } from '@fixtures/index';
import { ROUTES, TEST_TAGS, ERROR_MESSAGES } from '@constants/index';
import { getAdminCredentials } from '@factories/user-data';

test.describe(`${TEST_TAGS.REGRESSION} ${TEST_TAGS.AUTH} Login`, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('valid credentials redirect to dashboard', async ({ loginPage, page }) => {
    const creds = getAdminCredentials();
    await loginPage.login(creds.email, creds.password);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await expect(page.getByTestId('user-avatar')).toBeVisible();
  });

  test('wrong password shows error message', async ({ loginPage }) => {
    const creds = getAdminCredentials();
    await loginPage.login(creds.email, 'wrongpassword123');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('unknown email shows error message', async ({ loginPage, page }) => {
    await loginPage.login('nobody@hiresync.test', 'somepass');
    await expect(page.getByTestId('login-error-banner')).toBeVisible();
  });

  test('login button is disabled when email is empty', async ({ page }) => {
    await page.getByTestId('login-password-input').fill('somepassword');
    await expect(page.getByTestId('login-submit-btn')).toBeDisabled();
  });

  test('login button is disabled when password is empty', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('user@test.com');
    await expect(page.getByTestId('login-submit-btn')).toBeDisabled();
  });

  test('invalid email format shows validation error', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('not-an-email');
    await page.getByTestId('login-password-input').fill('somepassword');
    await page.getByTestId('login-email-input').blur();
    await expect(page.getByTestId('email-validation-error')).toBeVisible();
    await expect(page.getByTestId('email-validation-error')).toContainText(
      ERROR_MESSAGES.INVALID_EMAIL
    );
  });

  test('going to /candidates without login redirects to login page', async ({ page }) => {
    await page.goto(ROUTES.CANDIDATES);
    await expect(page).toHaveURL(/login/);
  });

  test('forgot password link navigates away from login', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/forgot-password/);
  });
});
