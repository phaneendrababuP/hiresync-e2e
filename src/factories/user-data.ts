import { ENV } from '@helpers/env';

// Admin credentials from env — this account is pre-seeded on staging and dev.

export function getAdminCredentials() {
  return {
    email: ENV.ADMIN_EMAIL,
    password: ENV.ADMIN_PASSWORD,
  };
}
