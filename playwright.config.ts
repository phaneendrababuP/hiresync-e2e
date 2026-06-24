import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load the correct .env file based on ENV variable. Defaults to staging.
// Example: ENV=dev npx playwright test
const environment = process.env.ENV || 'staging';
dotenv.config({ path: path.resolve(__dirname, `env/.env.${environment}`) });

const BASE_URL = process.env.BASE_URL || 'https://staging.hiresync.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  timeout: 45 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  reporter: process.env.CI
    ? [
        ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: true }],
        ['line'],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [['html', { open: 'never', outputFolder: 'playwright-report' }], ['line']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-testid',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
  },

  projects: [
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  outputDir: 'test-results/',
});
