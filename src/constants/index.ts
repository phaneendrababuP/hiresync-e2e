// Application routes, timeouts, error messages, and test tags.
// Pulled these out of test files after updating them in multiple places got annoying.

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CANDIDATES: '/candidates',
  JOBS: '/jobs',
} as const;

export const TIMEOUTS = {
  DEFAULT: 15_000,
  // NLP and scoring can take a few seconds to process
  AI_PROCESSING: 45_000,
} as const;

export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  API: '@api',
  AUTH: '@auth',
  CANDIDATES: '@candidates',
  AI: '@ai',
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_EMAIL: 'Please enter a valid email address',
} as const;

export const SUCCESS_MESSAGES = {
  STATUS_UPDATED: 'Status updated successfully',
} as const;

// Minimum NLP confidence score we accept before flagging a parse result.
// Agreed with the dev team — anything below 0.65 means the resume couldn't be parsed reliably.
export const AI_CONFIDENCE_THRESHOLDS = {
  MEDIUM: 0.65,
} as const;

export const AUTH_STATE_PATHS = {
  ADMIN: '.auth/admin.json',
} as const;

// Pipeline stages a candidate can be in.
// Defined here so page objects and tests share the same type.
export type CandidateStatus =
  | 'applied'
  | 'screening'
  | 'assessment_pending'
  | 'assessment_completed'
  | 'shortlisted'
  | 'rejected'
  | 'hired';
