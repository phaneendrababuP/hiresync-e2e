import { authenticatedTest as test, expect } from '@fixtures/index';
import { ROUTES, TEST_TAGS } from '@constants/index';

test.describe(`${TEST_TAGS.SMOKE} Critical Path`, () => {
  test('dashboard loads after login', async ({ page }) => {
    await page.goto(ROUTES.DASHBOARD);
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('sidebar-nav')).toBeVisible();
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    await expect(page.getByTestId('dashboard-metrics-panel')).toBeVisible();
  });

  test('candidates list loads with at least one row', async ({ candidatesListPage }) => {
    await candidatesListPage.navigate();
    const count = await candidatesListPage.getCandidateCount();
    expect(count).toBeGreaterThan(0);
  });

  test('jobs list page loads', async ({ jobsListPage }) => {
    // navigate() internally waits for the jobs table to be visible
    await jobsListPage.navigate();
  });

  test('candidates API returns a valid response', async ({ candidatesApi }) => {
    const result = await candidatesApi.listCandidates();
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.data)).toBeTruthy();
  });

  test('recruiter can open a candidate profile from the list', async ({
    page,
    candidatesListPage,
  }) => {
    await page.goto(ROUTES.DASHBOARD);
    await page.getByTestId('nav-candidates').click();
    await expect(page).toHaveURL(/candidates/);

    const firstRow = page.getByTestId('candidate-row').first();
    const name = await firstRow.getByTestId('candidate-name').innerText();
    await firstRow.click();

    await expect(page).toHaveURL(/candidates\/.+/);
    await expect(page.getByTestId('candidate-name-heading')).toContainText(name);
  });
});
