import { randomEmail, randomFirstName, randomLastName, randomPhone } from '@helpers/random';

// Builds candidate payloads for API tests.
// Switched to random emails after parallel runs started hitting duplicate email conflicts.

export function buildCandidate(jobId: string, overrides?: Record<string, unknown>) {
  return {
    firstName: randomFirstName(),
    lastName: randomLastName(),
    email: randomEmail('candidate'),
    phone: randomPhone(),
    jobId,
    ...overrides,
  };
}
