import { authenticatedTest as test, expect } from '@fixtures/index';
import { TEST_TAGS, AI_CONFIDENCE_THRESHOLDS } from '@constants/index';

// NLP and scoring outputs are non-deterministic.
// Tests assert ranges and thresholds, not exact values.

test.describe(`${TEST_TAGS.REGRESSION} ${TEST_TAGS.AI} NLP and Scoring`, () => {
  test.describe('screened candidate NLP results', () => {
    test.beforeEach(async ({ candidatesListPage, page }) => {
      await candidatesListPage.navigate();
      await candidatesListPage.filterByStatus('screening');

      const isEmpty = await candidatesListPage.isEmptyStateVisible();
      test.skip(isEmpty, 'No candidates in screening');

      await page.getByTestId('candidate-row').first().click();
    });

    test('NLP confidence score meets the minimum threshold', async ({ candidateDetailPage }) => {
      const confidence = await candidateDetailPage.getNLPConfidenceScore();
      expect(confidence).toBeGreaterThanOrEqual(AI_CONFIDENCE_THRESHOLDS.MEDIUM);
    });

    test('NLP skills list returns at least one skill', async ({ candidateDetailPage }) => {
      const skills = await candidateDetailPage.getNLPParsedSkills();
      expect(skills.length).toBeGreaterThan(0);
    });

    test('NLP experience years is a non-negative number', async ({ candidateDetailPage }) => {
      const years = await candidateDetailPage.getNLPExperienceYears();
      expect(years).toBeGreaterThanOrEqual(0);
      expect(years).toBeLessThan(50);
    });
  });

  test.describe('assessed candidate scoring results', () => {
    test.beforeEach(async ({ candidatesListPage, page }) => {
      await candidatesListPage.navigate();
      await candidatesListPage.filterByStatus('assessment_completed');

      const isEmpty = await candidatesListPage.isEmptyStateVisible();
      test.skip(isEmpty, 'No assessed candidates');

      await page.getByTestId('candidate-row').first().click();
    });

    test('competency score is between 0 and 100', async ({ candidateDetailPage }) => {
      const score = await candidateDetailPage.getCompetencyScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('Big5 psychometric chart renders after assessment completion', async ({ page }) => {
      await expect(page.getByTestId('psychometric-section')).toBeVisible();
      await expect(page.getByTestId('big5-chart').locator('svg path').first()).toBeVisible({
        timeout: 45_000,
      });
    });
  });

  test('NLP parse API returns skills and confidence score', async ({ candidatesApi }) => {
    const result = await candidatesApi.listCandidates();
    const screened = result.data.find((c: { status: string }) => c.status === 'screening');
    test.skip(!screened, 'No screened candidate in staging dataset');

    const nlpResult = await candidatesApi.getNLPParseResult(screened.id);
    expect(Array.isArray(nlpResult.skills)).toBeTruthy();
    expect(nlpResult.confidence).toBeGreaterThanOrEqual(0);
    expect(nlpResult.confidence).toBeLessThanOrEqual(1);
  });
});
