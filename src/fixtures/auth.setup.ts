import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from '@pages/auth/login.page';
import { getAdminCredentials } from '@factories/user-data';
import { AUTH_STATE_PATHS, ROUTES } from '@constants/index';
import { logStep } from '@helpers/logger';

// Generates .auth/admin.json for storageState.
// Skips re-login if the file is less than 55 minutes old.

function needsRefresh(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  const ageMs = Date.now() - fs.statSync(filePath).mtimeMs;
  return ageMs > 55 * 60 * 1000;
}

setup('admin login', async ({ page }) => {
  const authPath = AUTH_STATE_PATHS.ADMIN;

  if (!needsRefresh(path.resolve(authPath))) {
    logStep('auth.setup', 'admin state is still valid, skipping login');
    return;
  }

  const creds = getAdminCredentials();
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(creds.email, creds.password);
  await page.waitForURL(`**${ROUTES.DASHBOARD}`, { timeout: 15_000 });

  fs.mkdirSync(path.dirname(path.resolve(authPath)), { recursive: true });
  await page.context().storageState({ path: authPath });
  logStep('auth.setup', 'admin state saved');
});
