import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// demo-mode.ts imports the Next.js request cookie store; outside a request
// there is none, so stub it with an empty store.
vi.mock('next/headers', () => ({ cookies: () => ({ get: () => undefined }) }));

import { isDemoMode, isMockMode } from './demo-mode';

const keys = ['BIRDIE_MOCK', 'DEFAULT_TENANT_SLUG'] as const;
const savedEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of keys) savedEnv[key] = process.env[key];
});

afterEach(() => {
  for (const key of keys) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

describe('isMockMode', () => {
  it('is true when BIRDIE_MOCK is unset', () => {
    delete process.env.BIRDIE_MOCK;
    expect(isMockMode()).toBe(true);
  });

  it('is true when BIRDIE_MOCK is "true"', () => {
    process.env.BIRDIE_MOCK = 'true';
    expect(isMockMode()).toBe(true);
  });

  it('is false only when BIRDIE_MOCK is exactly "false"', () => {
    process.env.BIRDIE_MOCK = 'false';
    expect(isMockMode()).toBe(false);
  });
});

describe('isDemoMode', () => {
  it('is true in mock mode', () => {
    delete process.env.BIRDIE_MOCK;
    expect(isDemoMode()).toBe(true);
  });

  it('is true for the demo tenant outside mock mode', () => {
    process.env.BIRDIE_MOCK = 'false';
    process.env.DEFAULT_TENANT_SLUG = 'demo';
    expect(isDemoMode()).toBe(true);
  });

  it('is false outside mock mode without the demo tenant or cookie', () => {
    process.env.BIRDIE_MOCK = 'false';
    delete process.env.DEFAULT_TENANT_SLUG;
    expect(isDemoMode()).toBe(false);
  });
});
