import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { credentialsFor, isMockMode } from './config.js';
import { fetchJobs } from './birdie-client.js';
import { driverFor, supportedNetzbetreiber } from './drivers/index.js';

// Mock mode is the default (BIRDIE_MOCK unset): the worker never opens a
// browser and never talks to the birdie API.

beforeEach(() => {
  // The mock driver logs every step; keep the test output quiet.
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('config', () => {
  it('runs in mock mode by default', () => {
    expect(isMockMode()).toBe(true);
  });

  it('credentialsFor returns mock credentials for any utility', () => {
    const creds = credentialsFor('anything');
    expect(creds).toEqual({ username: 'mock-user', password: 'mock-password', portalUrl: 'https://portal.utility.example' });
  });
});

describe('driverFor', () => {
  it('returns a mock driver for any utility name', () => {
    const driver = driverFor('anything');
    expect(driver).not.toBeNull();
    expect(driver!.netzbetreiber).toBe('anything');
    expect(typeof driver!.fillDraft).toBe('function');
  });

  it('still lists the real drivers shipped in this repository', () => {
    expect(supportedNetzbetreiber().length).toBeGreaterThan(0);
  });
});

describe('fillDraft on the sample queue', () => {
  it('yields two drafts and one deliberate failure', async () => {
    const jobs = await fetchJobs();
    expect(jobs).toHaveLength(3);

    const results = await Promise.all(
      jobs.map(async (job) => {
        const driver = driverFor(job.netzbetreiber)!;
        const creds = job.credentials ?? credentialsFor(job.netzbetreiber)!;
        return { job, result: await driver.fillDraft(job, creds) };
      }),
    );

    const ok = results.filter((r) => r.result.ok);
    const failed = results.filter((r) => !r.result.ok);
    expect(ok).toHaveLength(2);
    expect(failed).toHaveLength(1);

    for (const { result } of ok) {
      expect(result.draftRef).toMatch(/^MOCK-[A-Z0-9]{6}$/);
      expect(result.error).toBeUndefined();
    }
    // Draft references are derived from the offer id, so they must be distinct.
    expect(new Set(ok.map((r) => r.result.draftRef)).size).toBe(2);

    const [{ job, result }] = failed;
    expect(job.fields.kwp).toBeUndefined();
    expect(result.draftRef).toBeUndefined();
    expect(result.error).toContain('Anlagenleistung');
  });
});
