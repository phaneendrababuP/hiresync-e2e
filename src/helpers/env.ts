// Throws at startup if a required variable is missing.
// Prevents tests failing mid-run with a cryptic undefined error.

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `"${key}" is not set. Check env/.env.${process.env.ENV || 'staging'}.`
    );
  }
  return value;
}

export const ENV = {
  API_BASE_URL: requireEnv('API_BASE_URL'),
  ADMIN_EMAIL: requireEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: requireEnv('ADMIN_PASSWORD'),
};
