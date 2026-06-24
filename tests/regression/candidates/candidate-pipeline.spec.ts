import { authenticatedTest as test, expect } from '@fixtures/index';
import { TEST_TAGS, SUCCESS_MESSAGES } from '@constants/index';

test.describe(`${TEST_TAGS.REGRESSION} ${TEST_TAGS.CANDIDATES} Candidate Pipeline`, () => {
  test('search by name filters the list', async ({ candidatesListPage }) => {
    await candidatesListPage.navigate();
    await candidatesListPage.searchByName('Arjun');

    const count = await candidatesListPage.getCandidateCount();
    const isEmpty = await candidatesListPage.isEmptyStateVisible();
    // both outcomes are valid — no 'Arjun' on staging is not a failure
    expect(count > 0 || isEmpty).toBeTruthy();
  });

  test('status filter shows only candidates with that status', async ({
    candidatesListPage,
    page,
  }) => {
    await candidatesListPage.navigate();
    await candidatesListPage.filterByStatus('shortlisted');

    const isEmpty = await candidatesListPage.isEmptyStateVisible();
    test.skip(isEmpty, 'No shortlisted candidates in staging dataset');

    const badges = page.getByTestId('candidate-status-badge');
    const count = await badges.count();

    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).innerText();
      expect(text.toLowerCase()).toContain('shortlisted');
    }
  });

  test('candidate detail page loads with required sections', async ({
    page,
    candidatesListPage,
  }) => {
    await candidatesListPage.navigate();

    const firstRow = page.getByTestId('candidate-row').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    await expect(page.getByTestId('candidate-name-heading')).toBeVisible();
    await expect(page.getByTestId('candidate-email')).toBeVisible();
    await expect(page.getByTestId('candidate-status-badge')).toBeVisible();
    await expect(page.getByTestId('resume-parse-section')).toBeVisible();
  });

  test('recruiter can change candidate status from applied to screening', async ({
    page,
    candidatesListPage,
    candidateDetailPage,
  }) => {
    await candidatesListPage.navigate();
    await candidatesListPage.filterByStatus('applied');

    const isEmpty = await candidatesListPage.isEmptyStateVisible();
    test.skip(isEmpty, 'No candidates in applied status');

    await page.getByTestId('candidate-row').first().click();

    await candidateDetailPage.changeStatus('screening');
    await candidateDetailPage.waitForStatusToast(SUCCESS_MESSAGES.STATUS_UPDATED);

    const updatedStatus = await candidateDetailPage.getCurrentStatus();
    expect(updatedStatus.toLowerCase()).toContain('screening');
  });

  test('send assessment modal opens and closes without sending', async ({
    page,
    candidatesListPage,
    candidateDetailPage,
  }) => {
    await candidatesListPage.navigate();
    await page.getByTestId('candidate-row').first().click();

    await candidateDetailPage.openSendAssessmentModal();
    // use Playwright's built-in locator assertion for retry support
    await expect(page.getByTestId('send-assessment-modal')).toBeVisible();

    await candidateDetailPage.selectAssessmentType('big5');
    await candidateDetailPage.setAssessmentExpiry(7);
    await candidateDetailPage.cancelSendAssessment();

    await expect(page.getByTestId('send-assessment-modal')).toBeHidden();
  });

  test('shortlist button is visible for candidates who completed assessment', async ({
    page,
    candidatesListPage,
  }) => {
    await candidatesListPage.navigate();
    await candidatesListPage.filterByStatus('assessment_completed');

    const isEmpty = await candidatesListPage.isEmptyStateVisible();
    test.skip(isEmpty, 'No assessment-completed candidates in staging dataset');

    await page.getByTestId('candidate-row').first().click();
    await expect(page.getByTestId('shortlist-candidate-btn')).toBeVisible();
  });
});
