import { test, expect } from '@fixtures/index';
import { TEST_TAGS } from '@constants/index';
import { buildCandidate } from '@factories/candidate-data';

test.describe(`${TEST_TAGS.API} ${TEST_TAGS.CANDIDATES} Candidates API`, () => {
  // Each test creates and cleans up its own candidate.
  // No shared state between tests — each test runs independently.

  test('GET /candidates returns a list with pagination info', async ({ candidatesApi }) => {
    const result = await candidatesApi.listCandidates(1, 10);

    expect(typeof result.total).toBe('number');
    expect(result.page).toBe(1);
    expect(Array.isArray(result.data)).toBeTruthy();
  });

  test('POST /candidates creates a new candidate and returns id and status', async ({
    candidatesApi,
  }) => {
    const payload = buildCandidate('seeded-job-id-001');
    const candidate = await candidatesApi.createCandidate(payload);

    expect(candidate.id).toBeTruthy();
    expect(candidate.email).toBe(payload.email);
    expect(candidate.status).toBe('applied');

    // cleanup
    await candidatesApi.deleteCandidate(candidate.id).catch(() => {});
  });

  test('GET /candidates/:id returns the correct candidate', async ({ candidatesApi }) => {
    // create own candidate — no dependency on another test
    const payload = buildCandidate('seeded-job-id-001');
    const created = await candidatesApi.createCandidate(payload);

    const candidate = await candidatesApi.getCandidateById(created.id);
    expect(candidate.id).toBe(created.id);
    expect(candidate.email).toBe(payload.email);

    await candidatesApi.deleteCandidate(created.id).catch(() => {});
  });

  test('PATCH /candidates/:id/status updates to screening', async ({ candidatesApi }) => {
    const payload = buildCandidate('seeded-job-id-001');
    const created = await candidatesApi.createCandidate(payload);

    const updated = await candidatesApi.updateCandidateStatus(created.id, 'screening');
    expect(updated.status).toBe('screening');

    await candidatesApi.deleteCandidate(created.id).catch(() => {});
  });

  test('GET /candidates/:id without a token returns 401', async ({ candidatesApi }) => {
    const status = await candidatesApi.getCandidateWithoutAuth('some-candidate-id');
    expect(status).toBe(401);
  });
});
