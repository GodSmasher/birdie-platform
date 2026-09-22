import { describe, expect, it } from 'vitest';
import { connectors, getConnector } from './registry.js';
import { createContext } from './context.js';
import { createMockFetch } from './mock/fetch.js';
import { reonicExportDatanorm } from './connectors/reonic.js';
import type { TariffData } from './types.js';
import type { SevdeskInvoices } from './connectors/sevdesk.js';

// Mock mode is the default (BIRDIE_MOCK unset), so createContext() wires the
// mock transport plus placeholder config. A zero-latency transport keeps the
// suite fast; the routes and parsing code are identical.
const ctx = (id: string) => createContext(id, {}, { fetch: createMockFetch({ latencyMs: 0 }) });

describe('connector registry', () => {
  it('contains every documented connector exactly once', () => {
    const ids = connectors.map((c) => c.manifest.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining([
        'awattar', 'tibber', 'solcast', 'openweathermap', 'ecoflow', 'reonic',
        'sevdesk', 'google-calendar', 'gmail', 'whatsapp', 'google-drive',
      ]),
    );
    expect(getConnector('does-not-exist')).toBeUndefined();
  });

  for (const connector of connectors) {
    const id = connector.manifest.id;

    describe(id, () => {
      it('has a self-describing manifest', () => {
        expect(connector.manifest.name).toBeTruthy();
        expect(connector.manifest.capabilities.length).toBeGreaterThan(0);
        expect(connector.manifest.status).not.toBe('planned');
      });

      it('testConnection succeeds against the mock transport', async () => {
        const result = await connector.testConnection(ctx(id));
        expect(result.ok, result.message).toBe(true);
        expect(result.message).toBeTruthy();
      });

      it('pull resolves without throwing', async () => {
        await expect(connector.pull(ctx(id))).resolves.toBeDefined();
      });
    });
  }
});

describe('awattar', () => {
  it('returns 24 hourly price points with a consistent summary', async () => {
    const data = (await getConnector('awattar')!.pull(ctx('awattar'))) as TariffData;
    expect(data.provider).toBe('aWATTar');
    expect(data.currency).toBe('EUR');
    expect(data.points).toHaveLength(24);
    for (const p of data.points) {
      expect(Date.parse(p.end) - Date.parse(p.start)).toBe(3_600_000);
      expect(Number.isFinite(p.ctPerKwh)).toBe(true);
    }
    expect(data.cheapest).not.toBeNull();
    expect(data.mostExpensive).not.toBeNull();
    expect(data.cheapest!.ctPerKwh).toBeLessThanOrEqual(data.mostExpensive!.ctPerKwh);
    expect(data.avgCtPerKwh).toBeGreaterThanOrEqual(data.cheapest!.ctPerKwh);
    expect(data.avgCtPerKwh).toBeLessThanOrEqual(data.mostExpensive!.ctPerKwh);
  });
});

describe('sevdesk', () => {
  it('classifies the four mock invoices', async () => {
    const data = (await getConnector('sevdesk')!.pull(ctx('sevdesk'))) as SevdeskInvoices;
    expect(data.total).toBe(4);
    expect(data.invoices).toHaveLength(4);
    expect(data.overdueCount).toBeGreaterThanOrEqual(1);
    expect(data.paidCount).toBe(1);
    expect(data.openCount + data.paidCount).toBeLessThanOrEqual(data.total);
    expect(data.overdueSum).toBeGreaterThan(0);
    expect(data.invoices.every((i) => i.customer !== '—')).toBe(true);
  });
});

describe('reonic', () => {
  it('exports the mock catalog as a DATANORM 4.0 file', async () => {
    const { count, datanorm } = await reonicExportDatanorm(ctx('reonic'));
    expect(count).toBe(4);
    const lines = datanorm.split('\r\n');
    // Header: V;<dd.mm.yyyy>;.birdie Export;EUR;4;
    expect(lines[0]).toMatch(/^V;\d{2}\.\d{2}\.\d{4};\.birdie Export;EUR;4;$/);
    const articles = lines.filter((l) => l.startsWith('A;'));
    expect(articles).toHaveLength(4);
    expect(articles.map((l) => l.split(';')[2])).toEqual(['ES-440-GG', 'EI-H10', 'EST-10', 'EC-11']);
    expect(datanorm.endsWith('\r\n')).toBe(true);
  });
});
