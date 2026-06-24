// Random data for test factories.
// Using Date.now() + random suffix to avoid email collisions in parallel runs.

const FIRST_NAMES = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Kiran', 'Divya'];
const LAST_NAMES = ['Sharma', 'Patel', 'Kumar', 'Reddy', 'Singh', 'Nair', 'Iyer', 'Gupta'];

export function randomFirstName(): string {
  return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

export function randomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

export function randomEmail(prefix = 'qa'): string {
  const suffix = `${Date.now()}${Math.random().toString(36).substring(2, 6)}`;
  return `${prefix}.${suffix}@hiresync.test`;
}

export function randomPhone(): string {
  const n = Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
  return `+91${n}`;
}
