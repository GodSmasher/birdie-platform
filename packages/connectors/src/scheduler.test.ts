import { describe, expect, it } from 'vitest';
import { runBatch, summarize, type PollJob } from './scheduler.js';

function buildJobs(): PollJob[] {
  const jobs: PollJob[] = Array.from({ length: 6 }, (_, i) => ({
    id: `inst-${i}`,
    connectorId: 'awattar',
    installationId: `site-${i}`,
    tenantId: 'test',
    config: { region: i % 2 === 0 ? 'de' : 'at' },
  }));
  jobs.push({ id: 'broken', connectorId: 'does-not-exist', config: {} });
  return jobs;
}

describe('runBatch', () => {
  it('isolates a failing job and completes the batch', async () => {
    const jobs = buildJobs();
    const t0 = Date.now();
    const results = await runBatch(jobs, {
      concurrency: 3,
      retry: { retries: 0 },
      minIntervalMsPerConnector: 0,
      keepReadings: true,
    });
    const totalMs = Date.now() - t0;

    expect(results).toHaveLength(jobs.length);
    // Results keep the input order.
    expect(results.map((r) => r.job.id)).toEqual(jobs.map((j) => j.id));

    const awattar = results.filter((r) => r.job.connectorId === 'awattar');
    expect(awattar).toHaveLength(6);
    for (const r of awattar) {
      expect(r.ok, r.error).toBe(true);
      expect(r.error).toBeUndefined();
      expect(r.readingCount).toBeGreaterThan(0);
      expect(r.readings).toHaveLength(r.readingCount);
    }

    const broken = results.find((r) => r.job.id === 'broken')!;
    expect(broken.ok).toBe(false);
    expect(broken.error).toContain('does-not-exist');
    expect(broken.readingCount).toBe(0);

    const summary = summarize(results, totalMs);
    expect(summary).toMatchObject({ jobs: 7, ok: 6, failed: 1, totalMs });
    expect(summary.totalReadings).toBe(awattar.reduce((n, r) => n + r.readingCount, 0));
    expect(summary.maxMs).toBe(Math.max(...results.map((r) => r.durationMs)));
  });

  it('omits readings unless keepReadings is set', async () => {
    const [result] = await runBatch([buildJobs()[0]], { retry: { retries: 0 } });
    expect(result.ok).toBe(true);
    expect(result.readings).toBeUndefined();
    expect(result.readingCount).toBeGreaterThan(0);
  });
});

describe('summarize', () => {
  it('handles an empty batch', () => {
    expect(summarize([], 0)).toEqual({ jobs: 0, ok: 0, failed: 0, totalReadings: 0, totalMs: 0, maxMs: 0 });
  });
});
