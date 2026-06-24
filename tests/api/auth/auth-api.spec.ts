import { test, expect } from '@fixtures/index';
import { TEST_TAGS } from '@constants/index';
import { getAdminCredentials } from '@factories/user-data';

test.describe(`${TEST_TAGS.API} ${TEST_TAGS.AUTH} Auth API`, () => {
  test('login with valid credentials returns a token', async ({ authApi }) => {
    const creds = getAdminCredentials();
    const result = await authApi.login(creds.email, creds.password);

    expect(typeof result.accessToken).toBe('string');
    expect(result.accessToken.length).toBeGreaterThan(0);
    expect(typeof result.expiresIn).toBe('number');
  });

  test('login with wrong password returns 401', async ({ authApi }) => {
    const creds = getAdminCredentials();
    const status = await authApi.loginGetStatus(creds.email, 'wrongpassword');
    expect(status).toBe(401);
  });

  test('login with unknown email returns 401', async ({ authApi }) => {
    const status = await authApi.loginGetStatus('nobody@psyhire.test', 'somepass');
    expect(status).toBe(401);
  });

  test('login with empty email returns 400', async ({ authApi }) => {
    const status = await authApi.loginGetStatus('', 'somepass');
    expect([400, 422]).toContain(status);
  });

  test('login with empty password returns 400', async ({ authApi }) => {
    const creds = getAdminCredentials();
    const status = await authApi.loginGetStatus(creds.email, '');
    expect([400, 422]).toContain(status);
  });
});
